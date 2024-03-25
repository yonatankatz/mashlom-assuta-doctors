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
    
}]);