// controller.spec.js

describe('PhototherapyController', function() {
    var $controller, $scope;

    // Load the module that contains the controller before each test
    beforeEach(module('app'));

    // Inject the $controller service to instantiate the controller
    beforeEach(inject(function(_$controller_, $rootScope, _$timeout_) {
        $controller = _$controller_;
        $scope = $rootScope.$new();
        $timeout = _$timeout_;
    }));

    // Test the controller's behavior
    it('Sanity check', function(done) {
        var controller = $controller('PhototherapyController', { $scope: $scope });
        // INPUT
        controller.weekOfBirth = 'above38';
        controller.bilirubin = 12;
        controller.ageInHours = 48;
        controller.hasRiskFactors = false;

        // ACT
        controller.changedValue(function(result) {
            // TEST
            expect(result).toBe('done');
            expect(controller.rootDiagnose).toBe('לא נדרש טיפול באור');
            expect(controller.considerTransfusion).toBe('');
            expect(controller.distanceFromCurve).toBe('(מתחת לעקומה ב 2.5)');
            expect(controller.riskZoneObj).toEqual({ riskZone: 2, percentileString: 'באחוזון 85', explanation: 'שחרור עם מעקב בילירובין חוזר תוך 24 שעות' });
            expect(controller.statusColor["background-color"]).toBe('green');
            expect(controller.shouldFollowUp()).toBeTruthy();
            done(); // Signal that the test is complete
        });
        $timeout.flush();
    });

    // Add more tests as needed
});
