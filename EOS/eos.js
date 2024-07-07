// initialize variables
let intercept = 0;
let tempimp = 0;
let Romimp = 0
let ga4mdlng = 0
let ga4mdlng_sq = 0;
let Approptx = '';
let Approptx1 = 0
let Approptx2 = 0
let J_gbscar = '';
let J_gbscarPlus = 0
let J_gbscarU = 0

// function definition
function computeApproptx1() {
    // 1 if GBS specific antibiotics are given ≥2 hours prior to deliver OR any antibiotics given 2-3.9 hours prior to delivery, otherwise 0
    if (Approptx === 'GBS-2' || Approptx === 'broad-2') {
      return 1
    } else {
      return 0
    }
}

function computeApproptx2() {
    // 1 if Broad-spectrum antibiotics given ≥4 hours prior to delivery, otherwise 0
    if (Approptx === 'broad-4') {
      return 1
    } else {
      return 0
    }
}

function computeJ_gbscarPlus() {
    // 1 if GBS status is positive, otherwise 0
    if (J_gbscar === 'positive') {
      return 1
    } else {
      return 0
    }
}

function computeJ_gbscarU() {
    // 1 if GBS status is unknown, otherwise 0
    if (J_gbscar === 'unknown') {
      return 1
    } else {
      return 0
    }
}

function computeInterceptBeta() {
    if (intercept === "0.3") {
        return 40.0528
    } else if (intercept === "0.4") {
        return 40.3415
    } else if (intercept === "0.5") {
        return 40.5656
    } else if (intercept === "0.6") {
        return 40.7489
    } else {
        return 0
    }
}

function computeEOSChance() {
        console.log(computeInterceptBeta());
        console.log(0.8680 * tempimp) ;
        console.log(1.2256 * Romimp)
        console.log(6.9325 * ga4mdlng)
        console.log(0.0877 * ga4mdlng_sq)
        console.log(1.0488 * Approptx1)
        console.log(1.1861 * Approptx2)
        console.log((0.5771 * J_gbscarPlus))
        console.log((0.0427 * J_gbscarU))
      //                  intercept              + (0.8680[tempimp])  - (6.9325[ga4mdlng])  + (0.0877 [ga4mdlng_sq]) + (1.2256[romimp])  - (1.0488[approptx1])  - (1.1861[approptx2])  + (0.5771[j_gbscar(+)])   + (0.0427[j_gbscar(u)])
      const Betas =  computeInterceptBeta() + (0.8680 * tempimp) - (6.9325 * ga4mdlng) + (0.0877 * ga4mdlng_sq) + (1.2256 * Romimp) - (1.0488 * Approptx1) - (1.1861 * Approptx2) + (0.5771 * J_gbscarPlus) + (0.0427 * J_gbscarU)
      alert( ((1 / (1 + Math.E ** -Betas)) * 1000))
}

// listen to variables
window.onload1 =  () => {


    const ga4mdlngElement = document.getElementById("ga4mdlng")
    ga4mdlng = ga4mdlngElement.value;
    ga4mdlngElement.addEventListener("input", (event) => {
        ga4mdlng = ga4mdlngElement.value;
        ga4mdlng_sq = Math.pow(ga4mdlng, 2) // square the value
    })

    const ApproptxElement = document.getElementById("Approptx")
    Approptx = ApproptxElement.value;
    Approptx1 = computeApproptx1()
    Approptx2 = computeApproptx2()
    ApproptxElement.addEventListener("input", (event) => {
        Approptx = ApproptxElement.value;
        Approptx1 = computeApproptx1()
        Approptx2 = computeApproptx2()
    })

    const J_gbscarElement = document.getElementById("J_gbscar")
    J_gbscar = J_gbscarElement.value;
    J_gbscarPlus = computeJ_gbscarPlus()
    J_gbscarU = computeJ_gbscarU()
    J_gbscarElement.addEventListener("input", (event) => {
        J_gbscar = J_gbscarElement.value;
        J_gbscarPlus = computeJ_gbscarPlus()
        J_gbscarU = computeJ_gbscarU()
    })

    const btnElement = document.getElementById("computeEOSButton");
    btnElement.addEventListener("click", (event) => {
        computeEOSChance()
    })
}

var app = angular.module("app", []);
  
app.controller("EosController", ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    const ctrl = this;
    window.ctrl = this;

    ctrl.intercept = 0.5; // constant for Israel
    ctrl.temprature;
    ctrl.rom;
    ctrl.pregnancyLengthWeeks;
    ctrl.pregnancyLengthDays;
    ctrl.antibioticTreatment = '';
    ctrl.gps = '';

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
        if (ctrl.gps === 'positive') {
          return 1
        } else {
          return 0
        }
    }
    
    function computeJ_gbscarU() {
        // 1 if GBS status is unknown, otherwise 0
        if (ctrl.gps === 'unknown') {
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
      return ctrl.pregnancyLengthWeeks;
    }
    
    ctrl.resetAll = function() {
        ctrl.intercept = 0.5; // constant for Israel
        ctrl.temprature = undefined;
        ctrl.rom = undefined;
        ctrl.pregnancyLengthDays = undefined;
        ctrl.pregnancyLengthWeeks = undefined;        
        ctrl.antibioticTreatment = '';
        ctrl.gps = '';
    };

    ctrl.computeEOS = function() {            
          const betas =  computeInterceptBeta() + (0.8680 * computeTemprature()) - 
                                (6.9325 * computePregnancyLength()) + (0.0877 * Math.pow(computePregnancyLength(), 2)) + 
                                (1.2256 * computeROM()) - (1.0488 * computeApproptx1()) -
                                 (1.1861 * computeApproptx2()) + (0.5771 * computeJ_gbscarPlus()) + (0.0427 * computeJ_gbscarU());
          alert( ((1 / (1 + Math.E ** -betas)) * 1000))
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
