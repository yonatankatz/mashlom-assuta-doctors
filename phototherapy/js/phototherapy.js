var app = angular.module("app", []);
  
app.controller("PhototherapyController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    const ctrl = this;
    window.ctrl = this;

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


    ctrl.openRiskyConditions = function() {
        window.alert("opened!");
    };

    
    ctrl.weekOfBirth = '';
    ctrl.bilirubin = '';
    ctrl.ageInHours = '';

    ctrl.isFormComplete = function() {
        return ctrl.weekOfBirth && ctrl.bilirubin && ctrl.ageInHours;
    }
    
    // TODO real values
    var dataPoints38Risk = [
        { x: 0, y: 0 },
        { x: 24, y: 12 },
        { x: 48, y: 6 },
        { x: 72, y: 18 },
        { x: 96, y: 8 },
        { x: 120, y: 20 },
        { x: 144, y: 10 },
        { x: 168, y: 24 }
    ];

    // TODO real values
    var dataPoints38NoRisk = [
        { x: 0, y: 0 },
        { x: 24, y: 12 },
        { x: 48, y: 6 },
        { x: 72, y: 18 },
        { x: 96, y: 8 },
        { x: 120, y: 20 },
        { x: 144, y: 10 },
        { x: 168, y: 24 }
    ];

    // TODO real values
    var dataPoints3537Risk = [
        { x: 0, y: 0 },
        { x: 24, y: 12 },
        { x: 48, y: 6 },
        { x: 72, y: 18 },
        { x: 96, y: 8 },
        { x: 120, y: 20 },
        { x: 144, y: 10 },
        { x: 168, y: 24 }
    ];

    // TODO real values
    var dataPoints3537NoRisk = [
        { x: 0, y: 0 },
        { x: 24, y: 12 },
        { x: 48, y: 6 },
        { x: 72, y: 18 },
        { x: 96, y: 8 },
        { x: 120, y: 20 },
        { x: 144, y: 10 },
        { x: 168, y: 24 }
    ];

    var dataPointsDictionary = {
        'risk-38': dataPoints38Risk,
        'no-risk-38': dataPoints38NoRisk,
        'risk-35-37': dataPoints3537Risk,
        'no-risk-35-37': dataPoints3537NoRisk,
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
        var weekOfBirth = document.querySelector('input[name="weekOfBirth"]:checked').value;
        var bilirubin = document.getElementById('bilirubin').value;
        var ageInHours = document.getElementById('ageInHours').value;
        var riskFactors = document.querySelector('input[name="riskFactors"]:checked').value;

        var graphToUse = getGraph(weekOfBirth, riskFactors)
        console.log("chosen graph: " + graphToUse)
        var distance = distanceFromCurve(dataPointsDictionary[graphToUse], ageInHours, bilirubin);
        let lightTreatment = 'ללא טיפול באור';
        if (distance > 0){
            lightTreatment = 'טיפול באור';
        }

        document.getElementById('lightTreatment').value = lightTreatment;
        document.getElementById('nextVisit').value = "48 שעות";
        const distText = distance > 0 ? 'מעל ב - ' : 'מתחת ב - ';
        if (distance === 0){ 
            document.getElementById('distanceFromGraph').value = 'ערך על העקומה';
        } else {
            document.getElementById('distanceFromGraph').value = distText + Math.abs(distance.toFixed(2));
        }
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