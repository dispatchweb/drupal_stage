/**
 *  Require ALL the things...we need to build our site.
 */

require('es6-promise').polyfill();
var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  sass = require('gulp-sass'),
  compass = require('gulp-compass'),
  cleanCSS = require('gulp-clean-css'),
  prefix = require('gulp-autoprefixer'),
  cp = require('child_process'),
  uglify = require('gulp-uglify'),
  plumber = require('gulp-plumber'),
  gzip = require('gulp-gzip');
  shell = require('gulp-shell');
  runSequence = require('run-sequence');



/**
 * Compile files from assets/css into both _site/assets/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass-deploy', function() {
  gulp.src('assets/css/**/*.scss')
    .pipe(sass({
      includePaths: ['assets/css'],
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 10','ie 9','ie 8'], {
      cascade: true
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('assets/css'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function() {
  gulp.watch('assets/sass/**', ['compass']);
  gulp.watch('assets/js/dev/**', ['scripts'])
});

// Compile Compass/sass
gulp.task('compass', function() {
  gulp.src('assets/sass/**.scss')
    .pipe(plumber())
    .pipe(compass({
      css: 'assets/css',
      sass: 'assets/sass',
      image: 'assets/images',
      require: ['breakpoint', 'singularitygs', 'toolkit', 'breakpoint']
    }))
    //.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(prefix({
      browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ie 10', 'opera 12.1', 'ios 6', 'android 4']
    }))
    .pipe(gulp.dest('assets/css'));
    runSequence('drush');
});

 
gulp.task('minify-css', function() {
  return gulp.src('/assets/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

/**
 * Runs drush cr.
 */
// run drush to clear the theme registry.
gulp.task('drush', shell.task([
  'ddev exec drush cr'
]));


gulp.task('scripts', function() {
  gulp.src('assets/js/dev/**.js')
    .pipe(plumber())
    .pipe(uglify())
    //.pipe(gzip())
    .pipe(gulp.dest('assets/js/prod/'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(gulp.dest('assets/js/prod/'));
    runSequence('drush');
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['watch']);

gulp.task('deploy', ['sass-deploy']);