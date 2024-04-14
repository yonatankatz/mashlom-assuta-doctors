var app = angular.module("app", []);
  
app.controller("PhototherapyController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    const ctrl = this;
    window.ctrl = this;
    ctrl.dataShown = 'CALCULATOR'; // possible values: CALCULATOR, RISKS, PHOTOTHERAPY_GRAPH, GRAPH_BUTANI, EXCHANGE_TRANSFUSION_GRAPH
    ctrl.weekOfBirth = 'above38';
    ctrl.bilirubin;
    ctrl.ageInHours;
    ctrl.hasRiskFactors = false;
    ctrl.rootDiagnose = '';
    ctrl.distanceFromCurve = '';
    ctrl.riskZoneObj = {};
    ctrl.statusColor = {};
    ctrl.considerTransfusion = '';
    // ctrl.protocols = ['היפרקלמיה'];
    kabala_siudit =  ['הפשטה מלאה', 'ביצוע סימנים חיוניים וניטור', 'אקג', 'במידה ויש שינויים באקג - דפיברילטור', 'VL2 ולקיחת מעבדה הכוללת ס"ד, כימיה וגזים'];
    treatment = ['קלציום גלקונוט 10% 30 ml או קלציום כלוריד 10% 10 mL – מתן בפוש איטי דרך CL. ייתכן צורך במנות נוספות כחצי שעה לאחר מכן',
            'בולוס של אינסולין 10 U ב dextrose 50% 50 ml',
            'ונטולין 10 מ״ג באנהלציה מתמשכת',
            'סודיום ביקרבונט Nahco3  150 בתוך    ליטר D5W',
            'באנדקציה  של חמצת מטבולית קשה PH<7.1, בהחייאה, חסר כרוני של ביקרבונט במטופלים עם CKD',
            'דיאליזה'
        ];
    decisions = ['במידה ואשפוז – מטופל סימפטומטי, לא יציב, מטופל שדורש דיאליזה לאור היפרקלמי רפרקטורית, מחלת בסיס המצריכה אשפוז',
                ' יש צורך  לשקול אשפוז בט״נ או פנימית מוגבר לאחר ייצוב המטופל',
                'התוויות לשחרור : מטופל יציב, היפרקלמיה  קלה , מטופל א-תסמיני וללא שינויים באקג'];
    releaseNotes = ['מעקב מעבדתי – יש לחזור על ס״ד וכימיה חוזרת במסגרת הקופ״ח בעוד 3 ימים',
                    'דיאטת דלת אשלגן',
                    'מעקב רופא משפחה לצורך איזון טיפול תרופתי ומעקב אחר תרופות נפרוטוקסיות ותרופות אשר מעלות אשלגן',
                    'חולה דיאליזה –?'];
    onGoingTreatment = ['אקג חוזר לאחר טיפול ',
                        'גזים חוזרים פעם בשעה',
                        'קטטר במידת הצורך'];
    ctrl.sections = [
        {'id': 1, 'displayName': 'תלונה' },
        {'id': 2, 'displayName': 'קבלה סיעודית', listItems: kabala_siudit },
        {'id': 3, 'displayName': 'בירור', imageSource: 'assets/hyperkalemia-diagnose.png' },
        {'id': 4, 'displayName': 'טיפול', listItems: treatment},
        {'id': 5, 'displayName': 'ניהול שוטף של המטופל', listItems: onGoingTreatment},
        {'id': 6, 'displayName':  'החלטה', listItems: decisions},
        {'id': 7, 'displayName':'המלצות בשחרור', listItems: releaseNotes}
        ];

    ctrl.clearContent = function(attr) {
        ctrl[attr]  = null;
    }

    ctrl.selectWeekOfBirth = function(value) {
        ctrl.weekOfBirth = value;
        ctrl.changedValue();
    };

    ctrl.selectRiskFactor = function(value) {
        ctrl.hasRiskFactors = value;
        ctrl.changedValue();
    }

    ctrl.allInputsSatisfied = function() {
        return ctrl.ageInHours && ctrl.bilirubin;
    }

    ctrl.riskZoneSatisfied = function() {
        return Object.keys(ctrl.riskZoneObj).length > 0;
    }

    ctrl.clearValues = function() {
        ctrl.rootDiagnose = '';
        ctrl.distanceFromCurve = '';
        ctrl.considerTransfusion = '';
        ctrl.riskZoneObj = {};
        ctrl.statusColor['background-color'] = '';
    };

    ctrl.changedValue = function() {   
        if (!ctrl.allInputsSatisfied()) {
            ctrl.clearValues();
            return;
        }
        // if the user types a two digits numbers - its weird that we immediately shows him the value after the
        // first digit. usually, the sign will be nagative. it doesn't feel good.
        // so -
        // for one digit - we just delay the display a little bit.
        // after two digits - we can show the value immediately.
        // that's why we have this timeoutMillis parameter.
        var timeoutMillis =  ctrl.ageInHours <= 9 ? 800 : 20;
        $timeout(function() {
            // we need to check again, as during the timeout one may delete the value.
            if (!ctrl.allInputsSatisfied()) {
                ctrl.clearValues();
                return;
            }
            const {shouldUse , delta} = shouldUsePhototherapy(ctrl.ageInHours, ctrl.bilirubin, ctrl.weekOfBirth === 'above38', ctrl.hasRiskFactors);
            ctrl.rootDiagnose = shouldUse ? "נדרש טיפול באור" : "לא נדרש טיפול באור";
            ctrl.distanceFromCurve = '(' + (shouldUse ? "מעל העקומה ב " : "מתחת לעקומה ב ") + delta + ")" ;
            ctrl.considerTransfusion = gerTransfusionResult(ctrl.ageInHours, ctrl.bilirubin, ctrl.weekOfBirth === 'above38', ctrl.hasRiskFactors);
            if (delta == 0) {
                ctrl.distanceFromCurve = "(על קו העקומה)";
            }
            ctrl.statusColor['background-color'] = shouldUse ? 'red' : 'green';
            if (ctrl.ageInHours >= 12){
                const newRiskZoneObj = getRiskZone(ctrl.ageInHours, ctrl.bilirubin, ctrl.hasRiskFactors, shouldUse);
                Object.assign(ctrl.riskZoneObj, newRiskZoneObj);
            } else {
                // Reset in case we already have data here from previous diagnose
                ctrl.riskZoneObj = {};
            }
        }, timeoutMillis) ;
    };

    ctrl.resetAll = function() {
        ctrl.bilirubin = '';
        ctrl.ageInHours = '';    
        ctrl.considerTransfusion = '';
    };

    ctrl.openGraph = function(graph, graphPath38, graphPath37) {
        ctrl.dataShown = graph;
        ctrl.imagePath38 = graphPath38;
        ctrl.imagePath37 = graphPath37;
    };

  
    ctrl.openRiskyConditions = function() {
        ctrl.dataShown = 'RISKS';
    };
    
    ctrl.closePanel = function() {
        ctrl.dataShown = 'CALCULATOR';
    };

}]);

app.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var prevValue = '';
            element.on('click', function () {
                if (!$window.getSelection().toString()) {                                        
                    this.setSelectionRange(0, this.value.length);                    
                }
            });
            element.on('input', function () {
                if(this.checkValidity()){
                    prevValue = this.value;
                  } else {
                    this.value = prevValue;
                    ngModelCtrl.$setViewValue(this.value);
                    ngModelCtrl.$render();
                  }
            });
        }
    };
}]);

app.directive('risks', function() {
    return {
        restrict: 'E',
        templateUrl: 'htmls/risks.html',
        link: function(scope, element, attrs) {
        }
    };
});

app.directive('graphs', function() {
    return {
        restrict: 'E',
        templateUrl: 'htmls/graphs.html',
        link: function(scope, element, attrs) {
            
        }
    };
});