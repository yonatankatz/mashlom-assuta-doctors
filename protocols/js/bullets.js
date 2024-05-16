app.directive('bullets', function($parse) {
    return {
        restrict: 'E',
        templateUrl: 'htmls/bullets.html',
        scope: {
            items: '=',
            bulletType: '='
        },
        link: function(scope, element, attrs) {
            console.log(scope.bulletType);
        }
    };
});
