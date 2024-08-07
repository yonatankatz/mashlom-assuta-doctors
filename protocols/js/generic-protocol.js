var app = angular.module("app", ['ngSanitize']);

app.controller("ProtocolController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    const ctrl = this;
    window.ctrl = this;
    ctrl.searchQuery = '';
    ctrl.isExpanded = false;
    ctrl.protocolData = window.protocolData;
    ctrl.sections = ctrl.protocolData.subsections;
    ctrl.toggleCollabse = function() {
        $timeout(function() {
            ctrl.isExpanded = !ctrl.isExpanded;            
            var accordionButtons = document.querySelectorAll('.accordion-button');
            accordionButtons.forEach(function(button) {                
                if (button.getAttribute("aria-expanded") == 'true' && !ctrl.isExpanded) {
                    button.click();
                }
                else if (button.getAttribute("aria-expanded") == 'false' && ctrl.isExpanded) {
                    button.click();
                }                                
            });
        });
    };

    ctrl.blurButton = function(event) {
        event.target.blur();
    }

    function init() {
        $timeout(function() {
            if (window.location.hash) {
                var element = document.querySelector('[data-bs-target="' + window.location.hash + '"]');
                if (element.getAttribute("aria-expanded") == 'false') {
                    element.click(); 
                }    
            }        
        }, 50);
    }

    init();
}]);

app.directive('protocolContent', function($parse) {
    return {
        restrict: 'E',
        templateUrl: 'htmls/protocol-content.html',
        link: function(scope, element, attrs) {
        }
    };
});
