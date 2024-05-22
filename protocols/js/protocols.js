var app = angular.module("app", []);

app.controller("ProtocolsController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {    
    const ctrl = this;
    window.ctrl = this;
    ctrl.openedSection = -1;
    ctrl.protocols = [];
    ctrl.searchQuery = '';
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

    ctrl.setSectionIsOpen = function(index) {
        if (index == ctrl.openedSection) {
            ctrl.openedSection = -1;
        }
        else {
            ctrl.openedSection = index;
        }
    }
    ctrl.sectionIsOpen = function(index) {
        return ctrl.openedSection == index;
    }

    init();

    

}]);

// collapse all accordions. the bug that it fixes is this:
// open an accordion, press on one of the sub-links, then press "back"
// in the browser.
// the accordion is still open.
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        var accordions = document.querySelectorAll('.accordion .collapse');
        accordions.forEach(function(accordion) {
            accordion.classList.remove('show');
        });
        var openedElements = document.querySelectorAll('.opened-accordion-color');
        openedElements.forEach(function(element) {
            element.classList.remove('opened-accordion-color');
            element.classList.add('closed-accordion-color');
        });
    }
});