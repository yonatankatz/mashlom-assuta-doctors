var app = angular.module("app", []);

app.controller("QuizController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    const ctrl = this;
    window.ctrl = this;
    ctrl.currQuestionIndex = 0;
    ctrl.selectedAnswer = -1;

    function init() {
        $http.get('data/quiz/emergency-care.json').then(function(response) {
            // The response.data contains the JSON object
            ctrl.quizData = response.data;
            ctrl.currQuestionIndex = 0;
        })
        .catch(function(error) {
            console.log('Error fetching quiz data file:', error);
        });
        $http.get('data/valid-measures.json').then(function(response) {
        })
        .catch(function(error) {
            console.log('Error fetching quiz data file:', error);
        });
    }
    init();

    ctrl.getQ = function() {
        if (ctrl.currQuestionIndex >= ctrl.quizData.length) {
            return {};
        }
        return ctrl.quizData[ctrl.currQuestionIndex];
    };

    ctrl.nextQuestion = function() {
        ++ctrl.currQuestionIndex;
    };

    ctrl.getSelected = function() {
        if (ctrl.selectedAnswer < 0) {
            return "";
        }
        return ctrl.getQ().options[ctrl.selectedAnswer];
    };

    ctrl.selectedAnswer = function(option) {
        ctrl.selectedAnswer = ctrl.getQ().options.indexOf(option);

    };


}]);