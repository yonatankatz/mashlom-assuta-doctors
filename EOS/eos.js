var app = angular.module("app", ["terms"]);

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

document.addEventListener('shown.bs.collapse', function (event) {
  let target = event.target;
  if (!isElementInViewport(target)) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

history.replaceState({ panel: 'CALCULATOR' }, '', window.location.pathname);
  
app.controller("EosController", ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    const ctrl = this;
    window.ctrl = this;
    ctrl.page = 'CALCULATOR'; // values: CALCULATOR, ANTIBIOTIC_TREATMENT, INSTRUCTIONS
    ctrl.intercept = 0.5; // constant for Israel
    ctrl.temprature;
    ctrl.rom;
    ctrl.pregnancyLengthWeeks;
    ctrl.pregnancyLengthDays;
    ctrl.antibioticTreatment;
    ctrl.gbs;
    ctrl.eosPerClinicalCondition = {};
    ctrl.eos = undefined;
    ctrl.eosString = undefined;

    ctrl.openPanel = function(page) {
      history.pushState({ panel: page }, '', '#' + page);
      ctrl.page = page;
    };

    window.onpopstate = function(event) {
      $rootScope.$apply(function() {
        if (event.state && event.state.panel) {
          ctrl.openPanel(event.state.panel);
        }
      });
   };

    ctrl.closePanel = function() {
      history.replaceState({ panel: 'CALCULATOR' }, '', window.location.pathname);
      ctrl.page = 'CALCULATOR';
    };

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
        return Number(ctrl.pregnancyLengthWeeks) + (Number(ctrl.pregnancyLengthDays) / 7);  
      }
      return Number(ctrl.pregnancyLengthWeeks);
    }

    ctrl.allValuesSatisfied = function() {
      return !!ctrl.intercept && !!ctrl.temprature && !!ctrl.rom && !!ctrl.pregnancyLengthWeeks && !!ctrl.antibioticTreatment && !!ctrl.gbs;
    };

    ctrl.calcEosPerClinicalCondition = function() {
      const wellAppearingLiklyhood = 0.41;
      const equivocalLiklyhood = 5.0;
      const clinicalIllnessLiklyhood = 21.2;

      const eosOdds = ctrl.eos / (1 - ctrl.eos);
      const wellAppearingOdds = wellAppearingLiklyhood * eosOdds;
      const equivocalOdds = equivocalLiklyhood * eosOdds;
      const clinicalIllnessOdds = clinicalIllnessLiklyhood * eosOdds;

      const wellAppearingP = wellAppearingOdds / (1 + wellAppearingOdds);
      const equivocalP = equivocalOdds / (1 + equivocalOdds);
      const clinicalIllnessP = clinicalIllnessOdds / (1 + clinicalIllnessOdds);      

      ctrl.eosPerClinicalCondition['Well Appearing'] = (wellAppearingP * 1000).toFixed(2);
      ctrl.eosPerClinicalCondition['Equivocal'] = (equivocalP * 1000).toFixed(2);
      ctrl.eosPerClinicalCondition['Clinical Illness'] = (clinicalIllnessP * 1000).toFixed(2);
    };

    ctrl.getClinicalRecommendation = function(clinicalCondition) {
      if (ctrl.tooHighTemprature()) {
        return 'טיפול אנטיביוטי אמפירי';
      }
      const eosPerClinicalCondition = ctrl.eosPerClinicalCondition[clinicalCondition];

      if (eosPerClinicalCondition < 1) {
        return "ללא תרביות, ללא טיפול אנטיביוטי";
      }
      else if (eosPerClinicalCondition < 3 && eosPerClinicalCondition >= 1) {
        return 'תרביות דם';
      }
      else {
        return 'טיפול אנטיביוטי אמפירי';
      }
    };

    ctrl.getClinicalConditionColor = function(clinicalCondition) {
      if (!!!ctrl.temprature) {
        return 'none';
      }
      if (parseInt(ctrl.temprature) >= 39) {
        return 'red';        
      }
      if (ctrl.eosPerClinicalCondition[clinicalCondition] < 1)
      {
        return 'green';
      }
      if (ctrl.eosPerClinicalCondition[clinicalCondition] >= 1 && ctrl.eosPerClinicalCondition[clinicalCondition] < 3) {
        return 'yellow';
      }
      if (ctrl.eosPerClinicalCondition[clinicalCondition] >= 3) {
        return 'red';
      }
    }

    ctrl.getTrackingRecommendation = function(clinicalCondition) {
      if (ctrl.tooHighTemprature()) {
        return 'ניטור רציף';
      }
      const eosPerClinicalCondition = ctrl.eosPerClinicalCondition[clinicalCondition];

      if (eosPerClinicalCondition < 1) {
        return "מעקב שגרתי";
      }
      else if (eosPerClinicalCondition < 3 && eosPerClinicalCondition >= 1) {
        return 'סימנים חיוניים כל 4 שעות למשך 24 שעות';
      }
      else {
        return 'ניטור רציף';
      }
    };

    ctrl.tooHighTemprature = function() {          
      return parseInt(ctrl.temprature) >= 39;
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
        ctrl.eosString = undefined;
    };

    ctrl.computeEOS = function() {            
      if (!ctrl.allValuesSatisfied()) {
        return false;
      }      
      const alreadyHasEos = !!ctrl.eosString;
      const betas =  computeInterceptBeta() + (0.8680 * computeTemprature()) - 
                                (6.9325 * computePregnancyLength()) + (0.0877 * Math.pow(computePregnancyLength(), 2)) + 
                                (1.2256 * computeROM()) - (1.0488 * computeApproptx1()) -
                                 (1.1861 * computeApproptx2()) + (0.5771 * computeJ_gbscarPlus()) + (0.0427 * computeJ_gbscarU());
      ctrl.eos = 1 / (1 + Math.E ** -betas);
      ctrl.eosString =  (ctrl.eos * 1000).toFixed(2);
      ctrl.calcEosPerClinicalCondition();
      if (!alreadyHasEos) { // first time EOS value appears, we want to scroll to it.
        $timeout(function() {
          document.getElementById('eos').scrollIntoView({
              behavior: 'smooth'
          });
        }, 100);
      }
      return true;
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

app.directive('clinicalRecommendation', function() {
  return {
      restrict: 'E',
      templateUrl: 'htmls/clinical-recommendation.html',
      scope: {
        condition: '@'
      },
      link: function(scope, element, attrs) {           
        scope.getRisk = function() {
          return ctrl.eosPerClinicalCondition[scope.condition];
        };  

        scope.tooHighTemprature = function() {          
          return ctrl.tooHighTemprature();
        };
      }

  };
});

app.directive('antibiotics', function() {
  return {
      restrict: 'E',
      templateUrl: 'htmls/antibiotics.html',
      link: function(scope, element, attrs) {           
      }

  };
});

app.directive('instructions', function() {
  return {
      restrict: 'E',
      templateUrl: 'htmls/instructions.html',
      link: function(scope, element, attrs) {           
      }

  };
});
