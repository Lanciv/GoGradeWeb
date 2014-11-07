/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

'use strict';

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var browserSync = require('browser-sync');
var argv = require('minimist')(process.argv.slice(2));

// Settings
var RELEASE = !!argv.release; // Minimize and optimize during a build?
var DEST = RELEASE ? './build' : './stage'; // The build output folder
var GOOGLE_ANALYTICS_ID = 'UA-XXXXX-X'; // https://www.google.com/analytics/web/
var AUTOPREFIXER_BROWSERS = [ // https://github.com/ai/autoprefixer
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

var src = {};
var watch = false;
var pkgs = (function() {
    var temp = {};
    var map = function(source) {
        for (var key in source) {
            temp[key.replace(/[^a-z0-9]/gi, '')] = source[key].substring(1);
        }
    };
    map(require('./package.json').dependencies);
    return temp;
}());

// The default task
gulp.task('default', ['serve']);

// Clean up
gulp.task('clean', del.bind(null, [DEST]));

// 3rd party libraries
gulp.task('vendor', function() {
    return merge(
        gulp.src('./src/semantic/build/packaged/themes/**/*.*')
        .pipe(gulp.dest(DEST + '/themes'))
    );
});

// Static files
gulp.task('assets', function() {
    src.assets = 'src/assets/**';
    return gulp.src(src.assets)
        .pipe($.changed(DEST))
        .pipe(gulp.dest(DEST))
        .pipe($.size({
            title: 'assets'
        }));
});


// Images
gulp.task('images', function() {
    src.images = 'src/images/**';
    return gulp.src(src.images)
        .pipe($.changed(DEST + '/assets/images'))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(DEST + '/assets/images'))
        .pipe($.size({
            title: 'images'
        }));
});

// HTML pages
gulp.task('pages', function() {
    src.pages = 'src/pages/**/*.html';
    return gulp.src(src.pages)
        .pipe($.changed(DEST))
        .pipe($.if(RELEASE, $.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: true
        })))
        .pipe(gulp.dest(DEST))
        .pipe($.size({
            title: 'pages'
        }));
});



// CSS style sheets
gulp.task('styles', function() {
    src.styles = 'src/less/main.less';
    return gulp.src(['./src/semantic/src/**/*.less', './src/less/main.less'])
        .pipe($.plumber())
        .pipe($.less({
            paths: [path.join(__dirname, '/src', '/less')],
            sourceMap: !RELEASE,
            sourceMapBasepath: __dirname
        }))
        .on('error', console.error.bind(console))
        .pipe($.concat('styles.css'))
        .pipe($.autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS
        }))
        .pipe($.csscomb())
        .pipe($.if(RELEASE, $.minifyCss()))
        .pipe(gulp.dest(DEST + '/css'))
        .pipe($.size({
            title: 'styles'
        }));
});

// Bundle
gulp.task('bundle', function(cb) {
    var started = false;
    var config = require('./config/webpack.js')(RELEASE);
    // var bundler =  webpack(config, function(err, stats) {
    //       if(err) throw new $.util.PluginError("webpack", err);
    //       $.util.log("[webpack]", stats.toString({
    //           // output options
    //       }));
    //   });
    var bundler = webpack(config);

    function bundle(err, stats) {
        if (err) {
            throw new $.util.PluginError('webpack', err);
        }

        !!argv.verbose && $.util.log('[webpack]', stats.toString({
            colors: true
        }));

        if (!started) {
            started = true;
            return cb();
        }
    }

    if (watch) {
        bundler.watch(200, bundle);
    } else {
        bundler.run(bundle);
    }
});

// Build the app from source code
gulp.task('build', ['clean'], function(cb) {
    runSequence(['vendor', 'assets', 'images', 'pages', 'styles', 'bundle'], cb);
});


// Launch a lightweight HTTP Server
gulp.task('serve', function(cb) {

    watch = true;

    runSequence('build', function() {
        browserSync({
            notify: false,
            ghostMode: false,
            open: false,
            // Customize the BrowserSync console logging prefix
            logPrefix: 'RSK',
            // Run as an https by uncommenting 'https: true'
            // Note: this uses an unsigned certificate which on first access
            //       will present a certificate warning in the browser.
            // https: true,
            server: DEST
        });

        gulp.watch(src.assets, ['assets']);
        gulp.watch(src.images, ['images']);
        gulp.watch(src.pages, ['pages']);
        gulp.watch(src.styles, ['styles']);
        gulp.watch(DEST + '/**/*.*', function(file) {
            browserSync.reload(path.relative(__dirname, file.path));
        });
        cb();
    });
});
