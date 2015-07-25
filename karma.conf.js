// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
      frameworks: ['mocha', 'sinon-chai', 'chai', 'chai-as-promised'],

    // list of files / patterns to load in the browser
      files: [
          'client/bower_components/angular/angular.js',
          'client/bower_components/angular-mocks/angular-mocks.js',
          'client/bower_components/angular-resource/angular-resource.js',
          'client/bower_components/angular-cookies/angular-cookies.js',
          'client/bower_components/angular-sanitize/angular-sanitize.js',
          'client/bower_components/angular-route/angular-route.js',
          'client/bower_components/angular-ui-router/release/angular-ui-router.js',
          'client/bower_components/angular-bootstrap/ui-bootstrap.js',
          'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          'client/bower_components/angular-ui-select2/src/select2.js',
          'client/bower_components/jquery/jquery.js',
          'client/bower_components/ng-grid/ng-grid-*.debug.js',
          'client/bower_components/ng-table/ng-table.js',
          'client/bower_components/angular-cookies/angular-cookies.js',
          'client/bower_components/lodash/dist/lodash.js',
          'client/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
          'client/app.js',
          'client/components/alerts/**/*.js',
          'client/components/titlesearch/**/*.js',
          'client/components/titlepicker/**/*.js',
          'client/components/contract_api/*.js',
          'client/components/navbar/**/*.js',
          'client/contract/**/*.js',
          'client/login/**/*.js',
          'client/main/**/*.js',
          'client/restriction/**/*.js',
          'test/unit/**/*-test.js'

      ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    reporters: ['mocha','junit'],

      // the default configuration
      junitReporter: {
          outputFile: './testresults/unittest-results.xml',
          suite: ''
      },

    plugins: [
        'karma-mocha',
        'karma-chrome-launcher',
        'karma-mocha-reporter',
        'karma-sinon-chai',
        'karma-chai-plugins',
        'karma-junit-reporter',
        'karma-phantomjs-launcher'
    ]
  });
};
