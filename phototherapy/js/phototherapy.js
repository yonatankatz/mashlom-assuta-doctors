var app = angular.module("app", []);
  
app.controller("PhototherapyController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    const ctrl = this;
    window.ctrl = this;

    ctrl.weekOfBirth = 'above38';
    ctrl.bilirubin;
    ctrl.ageInHours;
    ctrl.hasRiskFactors = false;
    ctrl.diagnose = '';
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

    ctrl.openRiskyConditions = function() {
        window.alert("opened!");
    };

    ctrl.changedValue = function() {   
        if (!ctrl.ageInHours || !ctrl.bilirubin) {
            return;
        }
        $timeout(function() {
            const newRiskZoneObj = getRiskZone(ctrl.ageInHours, ctrl.bilirubin, ctrl.hasRiskFactors, true);
            Object.assign(ctrl.riskZoneObj, newRiskZoneObj);    
        }, 20) ;
    };
  
    ctrl.calcTreatment = function() {
    };
    
    function getGraph(weekOfBirth, riskFactor) {
        if (weekOfBirth === '38+'){
            if (riskFactor === 'yes'){
                return 'risk-38'
            }
            else {
                return 'no-risk-38'
            }
        } else{
            if (riskFactor === 'yes'){
                return 'risk-35-37'
            }
            else {
                return 'no-risk-35-37'
            }
        }
    }
}]);

app.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                if (!$window.getSelection().toString()) {                                        
                    this.setSelectionRange(0, this.value.length);                    
                }
            });
        }
    };
}]);