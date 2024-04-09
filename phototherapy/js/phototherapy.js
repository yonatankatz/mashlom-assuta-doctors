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
    ctrl.considerTransfusion = false;

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
        return ctrl.ageInHours && ctrl.bilirubin && ctrl.ageInHours >= 6;
    }

    ctrl.riskZoneSatisfied = function() {
        return Object.keys(ctrl.riskZoneObj).length > 0;
    }

    ctrl.shouldShowConsiderTransfusion = function() {
        return ctrl.considerTransfusion;
    }

    ctrl.changedValue = function() {   
        if (!ctrl.allInputsSatisfied()) {
            return;
        }
        $timeout(function() {
            const {shouldUse , delta} = shouldUsePhototherapy(ctrl.ageInHours, ctrl.bilirubin, ctrl.weekOfBirth === 'above38', ctrl.hasRiskFactors);
            ctrl.rootDiagnose = shouldUse ? "נדרש טיפול באור" : "לא נדרש טיפול באור";
            ctrl.distanceFromCurve = '(' + (shouldUse ? "מעל העקומה ב " : "מתחת לעקומה ב ") + delta + ")" ;
            if (delta == 0) {
                ctrl.distanceFromCurve = "(על קו העקומה)";
            }
            ctrl.statusColor['background-color'] = shouldUse ? 'red' : 'green';
            if (ctrl.ageInHours >= 12){
                const newRiskZoneObj = getRiskZone(ctrl.ageInHours, ctrl.bilirubin, ctrl.hasRiskFactors, shouldUse);
                Object.assign(ctrl.riskZoneObj, newRiskZoneObj);
                ctrl.considerTransfusion = shouldConsiderTransfusion(ctrl.ageInHours, ctrl.bilirubin, ctrl.weekOfBirth === 'above38', ctrl.hasRiskFactors);
            } else {
                // Reset in case we already have data here from previous diagnose
                ctrl.riskZoneObj = {};
                // reset consider transfusion as it is undefined below 12.
                ctrl.considerTransfusion = false;
            }
        }, 20) ;
    };

    ctrl.resetAll = function() {
        ctrl.bilirubin = '';
        ctrl.ageInHours = '';    
        ctrl.considerTransfusion = false;
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