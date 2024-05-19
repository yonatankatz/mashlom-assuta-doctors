var app = angular.module("app", ['ngSanitize']);
  
app.controller("HyperkalemiaController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    const ctrl = this;
    window.ctrl = this;    
    ctrl.isExpanded = false;
    kabala_siudit =  [
        {value:'הפשטה מלאה'},
        {value:'ביצוע סימנים חיוניים וניטור'},
        {value:'אקג'},
        {value:'במידה ויש שינויים באקג - דפיברילטור'},
        {value:'VL2 ולקיחת מעבדה הכוללת ס"ד, כימיה וגזים'}];
    treatment = [
        {value:'קלציום גלקונוט 10% 30 ml או קלציום כלוריד 10% 10 mL – מתן בפוש איטי דרך CL. ייתכן צורך במנות נוספות כחצי שעה לאחר מכן'},
        {value:'בולוס של אינסולין 10 U ב dextrose 50% 50 ml'},
        {value:'ונטולין 10 מ״ג באנהלציה מתמשכת'},
        {value:'סודיום ביקרבונט Nahco3  150 בתוך    ליטר D5W'},
        {value:'באנדקציה  של חמצת מטבולית קשה PH<7.1, בהחייאה, חסר כרוני של ביקרבונט במטופלים עם CKD'},
        {value:'דיאליזה'}
        ];
    decisions = [
        {value:'במידה ואשפוז – מטופל סימפטומטי, לא יציב, מטופל שדורש דיאליזה לאור היפרקלמי רפרקטורית, מחלת בסיס המצריכה אשפוז'},
        {value:' יש צורך  לשקול אשפוז בט״נ או פנימית מוגבר לאחר ייצוב המטופל'},
        {value:'התוויות לשחרור : מטופל יציב, היפרקלמיה  קלה , מטופל א-תסמיני וללא שינויים באקג'}];
    releaseNotes = [
        {value:'מעקב מעבדתי – יש לחזור על ס״ד וכימיה חוזרת במסגרת הקופ״ח בעוד 3 ימים'},
        {value:'דיאטת דלת אשלגן'},
        {value:'מעקב רופא משפחה לצורך איזון טיפול תרופתי ומעקב אחר תרופות נפרוטוקסיות ותרופות אשר מעלות אשלגן'},
        {value:'חולה דיאליזה –?'}];
    onGoingTreatment = [
        {value:'אקג חוזר לאחר טיפול '},
        {value:'גזים חוזרים פעם בשעה'},
        {value:'קטטר במידת הצורך'}];
    caseTypes = ['קל: 5.5-6 mEq/L',
    'בנוני: 6.1-6.9 mEq/L',
    'קשה: 6.9-7 mEq/L'];
    caseDecription = ['א-סימפטומטי', 'חולשה', 'תסמיני GI', 'תסמיני CV – הפערת קצב VT/VF /TdP'];
    riskFactors = ['מטופלי דיאליזה', 'CKD', 'תרופתי כגון: NSAIDS , דיגוקסין , סקולין, בטא בלוקרים, ספירונולקטון, איקקור.'];
    ctrl.sections = [
        {'id': 1, 'displayName': 'תלונה', caseTypes, caseDecription, riskFactors},
        {'id': 2, 'displayName': 'קבלה סיעודית', listItems: kabala_siudit},
        {'id': 3, 'displayName': 'בירור', imageSource: 'assets/hyperkalemia-diagnose.png', imageDescription: 'שינויים באקג המתאימים להיפרקלמיה:' },
        {'id': 4, 'displayName': 'טיפול', listItems: treatment, bulletClass: "bullet-point"},
        {'id': 5, 'displayName': 'ניהול שוטף של המטופל', listItems: onGoingTreatment},
        {'id': 6, 'displayName':  'החלטה', listItems: decisions},
        {'id': 7, 'displayName':'המלצות בשחרור', listItems: releaseNotes}
        ];

    ctrl.toggleCollabse = function() {
        $timeout(function(){
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
        // just removing the "selection" indication.
        event.target.blur();
    };        

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
