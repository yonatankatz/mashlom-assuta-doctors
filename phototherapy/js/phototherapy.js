var app = angular.module("app", []);
  
app.controller("PhototherapyController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    const ctrl = this;
    window.ctrl = this;
    ctrl.dataShown = 'CALCULATOR'; // possible values: CALCULATOR, RISKS, GRAPH_38+, GRAPH_UNDER_38, GRAPH_BUTANI
    ctrl.weekOfBirth = 'above38';
    ctrl.bilirubin;
    ctrl.ageInHours;
    ctrl.hasRiskFactors = false;
    ctrl.rootDiagnose = '';
    ctrl.distanceFromCurve = '';
    ctrl.riskZoneObj = {};

    function init() {
        // check if needed
        // $http.get('/triage/data/canadian-pediatric-ed-triage.json').then(function(response) {
        //     // The response.data contains the JSON object
        //     ctrl.jsonData = response.data;    
        // })
        // .catch(function(error) {
        //     console.log('Error fetching phototherapy data file:', error);
        // });
    }
    init();

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


    ctrl.changedValue = function() {   
        if (!ctrl.allInputsSatisfied()) {
            return;
        }
        $timeout(function() {
            const {shouldUse , delta} = shouldUsePhototherapy(ctrl.ageInHours, ctrl.bilirubin, ctrl.weekOfBirth === 'above38', ctrl.hasRiskFactors);
            ctrl.rootDiagnose = shouldUse ? "נדרש טיפול באור" : "לא נדרש טיפול באור";
            ctrl.distanceFromCurve = '(' + (shouldUse ? "מעל העקומה ב " : "מתחת לעקומה ב ") + delta + ")" ;
            const newRiskZoneObj = getRiskZone(ctrl.ageInHours, ctrl.bilirubin, ctrl.hasRiskFactors, shouldUse);
            Object.assign(ctrl.riskZoneObj, newRiskZoneObj);    
        }, 20) ;
    };

    ctrl.resetAll = function() {
        ctrl.bilirubin = '';
        ctrl.ageInHours = '';    
    };

    ctrl.openGraph = function(graph, graphPath) {
        ctrl.dataShown = graph;
        ctrl.imagePath = graphPath;        
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
        link: function (scope, element, attrs) {
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