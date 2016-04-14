/////// SETTINGS ////////////

var browser = "firefox"

// Plugins can't be stores in package.josn right now.
//  - They are published to plugin registry rather than npm.
//  - They don't list their dependency plugins in their package.json.
//    This might even be impossible because dependencies can be platform specific.
var plugins = ['org.apache.cordova.file'];


var pkg = require('./package.json');
var cordova_lib = require('cordova-lib');
var cdv = cordova_lib.cordova.raw;
var del = require('del');

var gulp = require('gulp');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var copy = require('gulp-copy2');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

//////////////////////// TASKS /////////////////////////////

// All cordova-lib calls (except "cordova create") must be done from within
// the cordova project dir because cordova-lib determines projectRoot from
// process.cwd() in cordova-lib/src/cordova/util.js:isCordova()

// Check js code for errors
gulp.task('lint', function() {
    return gulp.src('src/js/index.js')
    .pipe(eslint({
		extends: 'eslint:recommended',
		globals: {
			"require": true,
			"Libraries": true,
			"$": true,
			"L": true,
			"_": true
		},
		envs: ['browser'],
		rules: {
			"no-console": ['warn']
		}
    }))
    .pipe(eslint.format())
	.pipe(eslint.failAfterError());
});
 
gulp.task('optimize', ["browserify"], function() {
  return gulp.src('www/js/include.js')
    .pipe(uglify())
    .pipe(gulp.dest('www/js'));
});

// Statically include all require() js stuff
gulp.task('browserify', shell.task([
    './node_modules/browserify/bin/cmd.js -r ./src/js/include.js:Libraries > www/js/include.js'
]));

//build css files 
gulp.task('sass', function () {
  return gulp.src('./src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./www/css'));
});

// Build restaurant clusters
gulp.task('clusters', shell.task([
    'python ./scripts/link_clusters.py src/js/restaurants.json www/js/restaurant_clusters.json'
]));

// Copy static files
gulp.task('copy', function() {
	var paths = [
        {src: 'src/img/**', dest: 'www/img/'},
        {src: 'node_modules/leaflet/dist/leaflet.css', dest: 'www/css/lib/'},
        {src: 'src/index.html', dest: 'www/index.html'},
        {src: 'src/js/restaurants.json', dest: 'www/js/restaurants.json'},

        {src: 'src/js/index.js', dest: 'www/js/index.js'},
    ];
	return copy(paths);
});

//gulp.task('prepare', ['lint', 'browserify', 'sass', 'clusters', 'copy', 'optimize'], function() {});
gulp.task('prepare', ['lint', 'browserify', 'sass',  'copy'], function() {});

gulp.task('android', ['prepare'], function(cb) {
    return cdv.run({platforms:['android'], options:['--device']});
});

gulp.task('browser', ['prepare'], function() {
    return cdv.run({platforms:['browser'], options:['--target=' + browser]});
});

gulp.task('clean', function(cb) {del(['www'], cb);});
