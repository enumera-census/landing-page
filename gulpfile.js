var gulp = require('gulp');
var merge = require('merge-stream');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

  // Bootstrap
  var bootstrap = gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // Font Awesome
  var fontAwesome = gulp.src([
      './node_modules/@fortawesome/fontawesome-free/**/*',
      '!./node_modules/@fortawesome/fontawesome-free/{less,less/*}',
      '!./node_modules/@fortawesome/fontawesome-free/{scss,scss/*}',
      '!./node_modules/@fortawesome/fontawesome-free/.*',
      '!./node_modules/@fortawesome/fontawesome-free/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('./vendor/fontawesome'))

  // jQuery
  var jQuery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  var jQueryEasing = gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./vendor/jquery-easing'))

  // Simple Line Icons
  var simpleLineIcons = gulp.src([
      './node_modules/simple-line-icons/fonts/**',
    ])
    .pipe(gulp.dest('./vendor/simple-line-icons/fonts'))

  var simpleLineIcons1 = gulp.src([
      './node_modules/simple-line-icons/css/**',
    ])
    .pipe(gulp.dest('./vendor/simple-line-icons/css'));

  return merge(bootstrap, fontAwesome, jQuery, jQueryEasing, simpleLineIcons, simpleLineIcons1);

});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', gulp.series(['css:compile'], function() {
  return gulp.src([
      './css/*.css',
      '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
}));

// CSS
gulp.task('css', gulp.series(['css:compile', 'css:minify']));

// Default task
gulp.task('default', gulp.series(['css', 'vendor']));

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task('dev', gulp.series(['css', 'browserSync'], function() {
  gulp.watch('./scss/*.scss', ['css']);
  gulp.watch('./*.html', browserSync.reload);
}));
