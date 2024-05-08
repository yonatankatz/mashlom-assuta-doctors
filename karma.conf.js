module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            '3rd-party/angularjs/angular.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'phototherapy/js/phototherapy.js',
            'phototherapy/js/calculation.js',
            'phototherapy/js/phototherapy.spec.js'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    })
}
