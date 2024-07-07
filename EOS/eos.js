var app = angular.module("app", []);
  
app.controller("EosController", ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    const ctrl = this;
    window.ctrl = this;

    ctrl.intercept = 0.5; // constant for Israel
    ctrl.temprature = 40;
    ctrl.rom = 10;
    ctrl.pregnancyLengthWeeks = 40;
    ctrl.pregnancyLengthDays;
    ctrl.antibioticTreatment = 'none';
    ctrl.gbs = 'positive';

    ctrl.eos;

    function computeApproptx1() {
        // 1 if GBS specific antibiotics are given ≥2 hours prior to deliver OR any antibiotics given 2-3.9 hours prior to delivery, otherwise 0
        if (ctrl.antibioticTreatment === 'GBS-2' || ctrl.antibioticTreatment === 'broad-2') {
          return 1
        } else {
          return 0
        }
    }
    
    function computeApproptx2() {
        // 1 if Broad-spectrum antibiotics given ≥4 hours prior to delivery, otherwise 0
        if (ctrl.antibioticTreatment === 'broad-4') {
          return 1
        } else {
          return 0
        }
    }
    
    function computeJ_gbscarPlus() {
        // 1 if GBS status is positive, otherwise 0
        if (ctrl.gbs === 'positive') {
          return 1
        } else {
          return 0
        }
    }
    
    function computeJ_gbscarU() {
        // 1 if GBS status is unknown, otherwise 0
        if (ctrl.gbs === 'unknown') {
          return 1
        } else {
          return 0
        }
    }

    // Generally, in israel its 0.5 . but we keep it for future use,
    // as this is part of the original equation.
    function computeInterceptBeta() {
        if (ctrl.intercept == 0.3) {
            return 40.0528
        } else if (ctrl.intercept == 0.4) {
            return 40.3415
        } else if (ctrl.intercept == 0.5) {
            return 40.5656
        } else if (ctrl.intercept == 0.6) {
            return 40.7489
        } else {
            return 0
        }
    }

    function computeROM() {
        return Math.pow((Number(ctrl.rom) + 0.05), 0.2);
    }

    function computeTemprature() {
        return (ctrl.temprature * (9/5)) + 32 // convert to C from F
    }

    function computePregnancyLength() {
      if (ctrl.pregnancyLengthDays) {
        return ctrl.pregnancyLengthWeeks + (ctrl.pregnancyLengthDays / 7);  
      }
      return ctrl.pregnancyLengthWeeks;
    }

    ctrl.allValuesSatisfied = function() {
      return !!ctrl.intercept && !!ctrl.temprature && !!ctrl.rom && !!ctrl.pregnancyLengthWeeks && !!ctrl.antibioticTreatment && !!ctrl.gbs
    };
    
    ctrl.resetAll = function() {
        ctrl.intercept = 0.5; // constant for Israel
        ctrl.temprature = undefined;
        ctrl.rom = undefined;
        ctrl.pregnancyLengthDays = undefined;
        ctrl.pregnancyLengthWeeks = undefined;        
        ctrl.antibioticTreatment = '';
        ctrl.gbs = '';
        ctrl.eos = undefined;
    };

    ctrl.computeEOS = function() {            
      const betas =  computeInterceptBeta() + (0.8680 * computeTemprature()) - 
                                (6.9325 * computePregnancyLength()) + (0.0877 * Math.pow(computePregnancyLength(), 2)) + 
                                (1.2256 * computeROM()) - (1.0488 * computeApproptx1()) -
                                 (1.1861 * computeApproptx2()) + (0.5771 * computeJ_gbscarPlus()) + (0.0427 * computeJ_gbscarU());
      ctrl.eos =  ((1 / (1 + Math.E ** -betas)) * 1000).toFixed(2);
      $timeout(function() {
        document.getElementById('eos').scrollIntoView({
            behavior: 'smooth'
        });
      }, 100);

    }
}]);

app.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var prevValue = '';
            element.on('click', function () {
                if (!$window.getSelection().toString()) {                                        
                    this.setSelectionRange(0, this.value.length);                    
                }
            });
            element.on('input', function () {
                if(this.checkValidity()){
                    prevValue = this.value;
                  } else {
                    this.value = prevValue;
                    ngModelCtrl.$setViewValue(this.value);
                    ngModelCtrl.$render();
                  }
            });
        }
    };
}]);
