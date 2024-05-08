var app = angular.module("app", []);
  
app.controller("PhototherapyController", ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
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

    ctrl.isFollowUpRelevant = function() {
        return ctrl.riskZoneObj.riskZone === 3 || 
        ctrl.riskZoneObj.riskZone === 4 || 
        (ctrl.riskZoneObj.riskZone == 2 && !ctrl.hasRiskFactors);
    }

    ctrl.shouldFollowUp = function() {
        return ctrl.riskZoneSatisfied() && ctrl.isFollowUpRelevant();
    }
    
    ctrl.clearValues = function() {
        ctrl.rootDiagnose = '';
        ctrl.distanceFromCurve = '';
        ctrl.considerTransfusion = '';
        ctrl.riskZoneObj = {};
        ctrl.statusColor['background-color'] = '';
    };

    /*returns true if values satisfied.*/
    ctrl.handleValuesSatisifed = function(callback) {
        if (!ctrl.allInputsSatisfied()) {
            ctrl.clearValues();
            if (callback) {
                callback('done-values-not-satisifed');
            }
            return false;
        }
        return true;
    }

    ctrl.changedValue = function(callback) {   
        if (!ctrl.handleValuesSatisifed(callback)) {
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
            if (!ctrl.handleValuesSatisifed(callback)) {
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
            if (callback) {
                callback('done');
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