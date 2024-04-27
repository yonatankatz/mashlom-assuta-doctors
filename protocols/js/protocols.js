var app = angular.module("app", []);
  
app.controller("ProtocolsController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    const ctrl = this;
    window.ctrl = this;
    ctrl.protocols = {};
    ctrl.urlSuffix = window.location.href.indexOf("localhost") > -1 ||
                     window.location.href.indexOf("127.0.0.1") > -1 ? ".html" : "";

    function init() {
        $http.get('./data/protocols.json').then(function(response) {
            ctrl.protocols = response.data.protocols;
        })
        .catch(function(error) {
            console.log('Error fetching protocols list data file:', error);
        });
    }

    ctrl.openUrl = function(link) {
        window.location.href = link + ctrl.urlSuffix;
    };

    init();

    

}]);
