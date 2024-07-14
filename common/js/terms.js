var app = angular.module("terms", []);

app.directive('terms', function() {
    return {
        restrict: 'E',
        templateUrl: '../common/htmls/terms.html',
        link: function(scope, element, attrs) {
            const termsSignedKey = 'mashlom.termsSigned';
            const termsVersion = Date.parse('2024-07-14');
            scope.termsSigned = localStorage.getItem(termsSignedKey) >= termsVersion;        

            scope.acceptTerms = function() {
                localStorage.setItem(termsSignedKey, Date.now());
                scope.termsSigned = true;
            };        
        }
    };
});