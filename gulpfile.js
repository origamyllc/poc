/**
 * Copied by TonyG on 2/4/14.
 */
 'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({ camelize: true }),
    wiredep = require('wiredep'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    path = require('path'),
    Q = require('q'),
    mongodev = undefined,
    lr = require('tiny-lr'),
    server = lr(),
    _ = require('lodash'),
    karma = require('karma').server;

    require('minijasminenode'); // puts jasmine in node global namespace
    require('jasmine-reporters'); // depends on jasmine being in node global namespace

    var jsapi = new jasmine.JsApiReporter();
    var junit = new jasmine.JUnitXmlReporter('./test/results/', true, true, 'TEST-');

// Project settings
var gulpconfig = {
  // configurable paths
  app: require('./bower.json').appPath || 'client',
  dist: 'dist',
  liveReloadPort: 35729
};


// MAIN TASKS
// ---------------------------------------------------------------------------------
gulp.task('default', ['clean'], function(){
    return gulp.start('bowerInstall', 'copyCss', 'server', 'lr-server', 'open', 'watch');
});

gulp.task('build', ['clean:dist'], function(){
    gulp.start('server:dist');
});

// NODE SERVER
// ---------------------------------------------------------------------------------
gulp.task('server', ['serverjs_hint'], function(){
  return plugins.nodemon({
    script: 'server.js',
    watch: ['server.js','server'],
    ext: 'html,js',
    nodeArgs: ['--debug']
  });
});

gulp.task('dist', ['usemin', 'imagemin']);

gulp.task('server:dist', ['usemin'], function(){
  process.env.NODE_ENV = 'production';
  return plugins.nodemon({
    script: 'dist/server.js',
    watch: ['server.js','server'],
    ext: 'html,js',
    nodeArgs: ['--production']//?
  });
});

gulp.task('lr-server', function () {
    server.listen(gulpconfig.liveReloadPort, function (err) {
        if (err) return console.log(err);
    });
});


// WATCHERS
// ---------------------------------------------------------------------------------
gulp.task('watch', function() {
  gulp.watch(gulpconfig.app + '/**/*.js', function(path) {
    console.log('Client JS change');
    gulp.start('clientjs_hint'); //test
    //gulp.src(path.path).pipe(livereload(server));
  });

  // gulp.watch('test/spec/{,*/}*.js', function(path) {
  //     console.log('Test JS change');
  //     gulp.start('testjs_hint');
  //     //karma
  // });

  gulp.watch(gulpconfig.app + '/components/css/**/*.css', function(path) {
    console.log('Client CSS change');
    gulp.start('copyCss');
  });

  gulp.watch([
      gulpconfig.app + '/**/*.html',
      '{.tmp,' + gulpconfig.app + '}/**/*.js',
      gulpconfig.app + '/components/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
    ],
    function(path) {
      gulp.src(path.path).pipe(plugins.livereload(server));
    });

  gulp.watch([
      'server.js',
      'server/**/*.{js,json}'
    ],
    function(path) {
      console.log('Server change.');
      gulp.start('serverjs_hint');
    });

  // Start reading from stdin so we don't exit.
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function(data) {
    data = (data + '').trim().toLowerCase();
    if (data === 'bs') {
      gulp.start('back_scenario');
    }
    if (data === 'bu') {
      gulp.start('back_unit');
    }
  });

});

// JS HINTS
// ---------------------------------------------------------------------------------
gulp.task('clientjs_hint', function() {
    gulp.src([gulpconfig.app + '/**/*.js','!' + gulpconfig.app + '/bower_components/**/*.js'])
    .pipe(plugins.jshint('client/.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('serverjs_hint', function() {
    gulp.src('server/{,*/}*.js')
    .pipe(plugins.jshint('server/.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// CSS
// ---------------------------------------------------------------------------------
gulp.task('copyCss', function() {
  gulp.src(gulpconfig.app + '/bower_components/select2/{*.png,*.gif}', {read: false})
  .pipe(gulp.dest('.tmp/components/css'));

  gulp.src(gulpconfig.app + '/components/css/ui-lightness/images/*.*', {read: false})
  .pipe(gulp.dest('.tmp/components/css/images/'));

  return gulp.src(gulpconfig.app + '/components/css/**/*.css')
  .pipe(plugins.autoprefixer('last 1 version', "> 1%", "ie 8", "ie 7") )
  .pipe(plugins.size({ showFiles: true }))
  .pipe(gulp.dest('.tmp/components/css'))
  .pipe(plugins.livereload(server));
});

gulp.task('copyCss:dist', ['clean:dist'], function() {
  return gulp.src(gulpconfig.app + '/components/css/**/*.css')
  .pipe(plugins.autoprefixer('last 1 version', "> 1%", "ie 8", "ie 7") )
  .pipe(plugins.size({ showFiles: true }))
  .pipe(gulp.dest('.tmp/components/css'))
  .pipe(plugins.livereload(server));
});

// CLEAN
// ---------------------------------------------------------------------------------
gulp.task('clean', function(){
    return gulp.src('.tmp/*', {read: false})
    .pipe(plugins.size({ showFiles: true }))
    .pipe(plugins.rimraf({force: true}));
});

gulp.task('clean:dist', function(){
    return gulp.src([
            '.tmp/*',
            gulpconfig.dist + '/*',
            gulpconfig.dist + '/components/*'], { read: false })
    .pipe(plugins.ignore(gulpconfig.dist + '/public/.git*'))
    .pipe(plugins.rimraf({ force: true }));
});


// BUILD COPY
// ---------------------------------------------------------------------------------
gulp.task('copyDist', ['copyCss:dist'], function() {
    gulp.src([
        gulpconfig.app + '/*.{ico,png,txt}',//root files
        gulpconfig.app + '/.htaccess',
        //gulpconfig.app + '/bower_components/**/*',
        //gulpconfig.app + '/components/images/**/*.{webp}'//no webp currently used.
    ])
    .pipe(gulp.dest(gulpconfig.dist + '/public'));

    gulp.src([
        gulpconfig.app + '/components/fonts/**/*',
    ])
    .pipe(gulp.dest(gulpconfig.dist + '/public/fonts'));

    // gulp.src([
    //     gulpconfig.app + '/views/**/*.jade'
    // ])
    // .pipe(gulp.dest(gulpconfig.dist + '/views'));

    // gulp.src([
    //     gulpconfig.dist + '/public/images/generated/*'
    // ])
    // .pipe(gulp.dest(gulpconfig.dist + '/public/images'));

    gulp.src([
        'package.json',
        'server.js'
    ])
    .pipe(gulp.dest(gulpconfig.dist));

    gulp.src('etc/**')
    .pipe(gulp.dest(gulpconfig.dist + '/etc'));

    gulp.src(gulpconfig.app + '/bower_components/select2/{*.png,*.gif}')
    .pipe(gulp.dest(gulpconfig.dist + '/public/styles'));

    return gulp.src('server/**/*')
    .pipe(gulp.dest(gulpconfig.dist + '/server'));

});

//BOWER INSTALL
// ---------------------------------------------------------------------------------
gulp.task('bowerInstall', function(){
    return wiredep({
        directory: gulpconfig.app + '/bower_components',
        bowerJson: require('./bower.json'),
        src: gulpconfig.app + '/app.html',
        ignorePath: gulpconfig.app + '/'
    });
});


// OPEN
// ---------------------------------------------------------------------------------
gulp.task('open', ['server'], function(){
    var indexFile = gulpconfig.app + "/app.html",
        options = {
            url : 'http://localhost:3000'
        };

    // A file must be specified as the src when running options.url or gulp will overlook the task.
    setTimeout(function(){
        return gulp.src(indexFile)
            .pipe(plugins.open("", options));
    }, 2200);
});



//USEMIN (including rev and htmlmin)
// ---------------------------------------------------------------------------------
gulp.task('usemin', ['clean:dist','bowerInstall', 'copyDist'], function() {
    gulp.src(gulpconfig.app + '/**/*.html', {base: gulpconfig.app})
    .pipe(plugins.usemin({
        assetsDir: 'public/',
        rev: true,
        htmlmin: plugins.minifyHtml({
            empty: true,        // DO NOT remove empty attributes
            cdata: true,        // DO NOT strip CDATA from scripts
            comments: true,     // DO NOT remove comments
            conditionals: true, // DO NOT remove conditional internet explorer comments
            spare: true,        // DO NOT remove redundant attributes
            quotes: true        // DO NOT remove arbitrary quotes
        })
    }))
    .pipe(plugins.size({ showFiles: true }))
    .pipe(gulp.dest(gulpconfig.dist + '/public'));
});


//OTHER MINIFIERS
// ---------------------------------------------------------------------------------
gulp.task('imagemin', function(){
    return gulp.src(gulpconfig.app + '/components/images/{,*/}*.{png,jpg,jpeg,gif}')
    .pipe(plugins.imagemin({optimizationLevel: 5}))
    .pipe(plugins.size({ showFiles: true }))
    .pipe(gulp.dest(gulpconfig.dist + '/public/components/images'));
});

gulp.task('svgmin', function() {
    return gulp.src(gulpconfig.app + '/components/images/{,*/}*.svg')
    .pipe(plugins.svgmin())
    .pipe(gulp.dest(gulpconfig.dist + '/public/components/images'));
});

gulp.task('ngmin', function() {
    return gulp.src(gulpconfig.dist + '/scripts/*.js')
    .pipe(plugins.ngmin())
    .pipe(gulp.dest(gulpconfig.dist + '/scripts'));
});

gulp.task('dbreset', ['dbcontracts', 'dbusers'], function() {
    console.log('finished running dependent tasks');
    process.exit(0);
});

gulp.task('dbinit', function() {
  if (mongodev) return mongodev;

  // Default node environment to development
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  if (process.env.NODE_ENV !== 'development') {
    throw {
      name: 'EnvironmentError',
      message: 'This task will reset your database and is only valid for process.env.NODE_ENV === "development"'
    };
  }

  // Application Config
  var config = require('./server/config/config');

  // Connect to database
  var db = mongoose.connect(config.mongo.uri, config.mongo.options);

  // Bootstrap models
  var modelsPath = path.join(__dirname, 'server/models');

  fs.readdirSync(modelsPath).forEach(function(file) {
    if (file.indexOf('-unit.js') > -1) return;
    console.log(modelsPath + '/' + file);
    require(modelsPath + '/' + file)(mongoose);
  });

  mongodev = {
    onResolveHandler: function(err) {
      if (err) return console.log(err);
      console.log('success');
      console.log('arguments', arguments);
    }
  };

});

gulp.task('dbusers', ['dbinit'], function() {
  var deferred = Q.defer();

  var User = require('./server/models/user')(mongoose);

  User
    .find({})
    .remove()
    .exec()
    .onResolve(mongodev.onResolveHandler)
    .then(function() {
      console.log('Populating collection for User');
      return User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      });
    })
    .onResolve(mongodev.onResolveHandler)
    .then(function(users) {
      deferred.resolve(users);
    });

    return deferred.promise;
});

gulp.task('dbcontracts', ['dbinit'], function(cb) {
  var ContractModel = mongoose.model('Contract');
  var sampleContract = require('./test/sample-contract.js').makeContract(mongoose);
  ContractModel
    .find({})
    .remove()
    .exec()
    .onResolve(mongodev.onResolveHandler)
    .then(function() {
      console.log('Populating collection for contracts');
      return ContractModel.create(sampleContract);
    })
    .onResolve(mongodev.onResolveHandler)
    .then(function(contracts) {
      mongoose.connection.close();
      cb(null);
    });
});

// TESTS
// ---------------------------------------------------------------------------------

gulp.task('test:unit', function(done) {

    return karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, done);
});

gulp.task('back:unit', ['test:unit'], function() {
  var mongoose = require('mongoose');
  mongoose.connection.close();
});

// BACKEND TESTS
// ---------------------------------------------------------------------------------
gulp.task('test:integration', function () {
   //'server:integration',
  process.env.NODE_ENV = 'integration';
 return runIntegrationTests({
     reporter: 'nyan',
  });

});

/**
 * HACK: Using this function for now, until I figure out how
 * to get ./test/mocha.opts recognized by gulp-mocha - LC
 */
function runIntegrationTests(opts) {

  var app = {}, defaults = {
    startExpress: false,
    reporter: 'spec',
    timeout: 10000 }, opts = _.defaults(opts || {}, defaults);

//js/**/*.js
var path='./test/integration/**/*-test.js';
  return gulp.src(path)
    .pipe(
      plugins.mocha({ reporter: opts.reporter, timeout: opts.timeout })
    ).pipe(plugins.exit());
}


gulp.task('test:integration:withserver', function() {

  return runIntegrationTests({
     startExpress: true,
     reporter: 'nyan'
  });
});

gulp.task('test:integration:bamboo', function() {
   return runIntegrationTests({
     startExpress: true,
     reporter: 'mocha-bamboo-reporter'
   });
});

gulp.task('test:functional', ['webdriver_update', 'testserver-start'], function() {
  return gulp.src(['./test/functional/*-test.js'])
  .pipe(plugins.protractor.protractor({
    configFile: 'protractor.conf.js',
  }))
  .on('error', function(e) { throw e })
  .on('end', function() {
    gulp.start('testserver-stop');
  });
});

gulp.task('test:dev-functional', ['webdriver_update'], function() {
  process.env.PORT = 3000;
  return gulp.src(['./test/functional/*-test.js'])
  .pipe(plugins.protractor.protractor({
    configFile: 'protractor.conf.js',
  }))
  .on('error', function(e) { throw e });
});

gulp.task('test:all',['test:functional', 'test:integration', 'test:unit']);

gulp.task('test:all:bamboo',['test:integration:bamboo']);



// FRONTEND TESTS
// ---------------------------------------------------------------------------------
// var webdriver_update = require('../').webdriver_update;
var server;

gulp.task('testserver-start', ['usemin'], function(cb) {
  process.env.PORT = 3000; // default value for config.port
  process.env.NODE_ENV = 'test';

  server = require('./' + gulpconfig.dist + '/server');
  server.on('listening', function() {
    cb();
  });
});

gulp.task('testserver-stop', function(cb) {
  server.close(function() {
    cb();
    process.exit(0);
  });
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', plugins.protractor.webdriver_update);
gulp.task('webdriver_standalone', plugins.protractor.webdriver_standalone);
