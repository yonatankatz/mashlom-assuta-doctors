var app = angular.module("app", []);
  
app.controller("PhototherapyController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    const ctrl = this;
    window.ctrl = this;

    ctrl.weekOfBirth = 'above38';
    ctrl.bilirubin;
    ctrl.ageInHours;
    ctrl.hasRiskFactors = false;
    ctrl.diagnose = '';

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
    };

    ctrl.selectRiskFactor = function(value) {
        ctrl.hasRiskFactors = value;
    }

    ctrl.openRiskyConditions = function() {
        window.alert("opened!");
    };
  
    // Linear interpolation function
    function interpolate(x0, y0, x1, y1, x) {
    return y0 + ((y1 - y0) / (x1 - x0)) * (x - x0);
      }
  
    function distanceFromCurve(dataPoints, x, y) {
        // Find the two points between which the X coordinate lies
        var i = 0;
        while (i < dataPoints.length - 1 && dataPoints[i + 1].x < x) {
            i++;
        }
  
        // Interpolate Y value at X coordinate
        var interpolatedY = interpolate(
        dataPoints[i].x,
        dataPoints[i].y,
        dataPoints[i + 1].x,
        dataPoints[i + 1].y,
        x
        );
  
    return y - interpolatedY;
    }
    
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