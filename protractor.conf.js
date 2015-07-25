// Protractor configuration
// https://github.com/angular/protractor/blob/master/docs/getting-started.md#setup-and-config

// An example configuration file.
exports.config = {
  // The file path to the selenium server jar.
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.40.0.jar',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    // version: '',
    // platform: 'ANY',
    'phantomjs.binary.path':'node_modules/phantomjs/bin/phantomjs'
  },

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  // specs: ['example-spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    isVerbose:true // Use colors in the command line report.
  }
};
