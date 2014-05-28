var gulp       = require('gulp');
var gutil      = require('gulp-util');
var concat     = require('gulp-concat');
var sass       = require('gulp-sass');
var minifyCss  = require('gulp-minify-css');
var rename     = require('gulp-rename');
var coffee     = require('gulp-coffee');
var plumber    = require('gulp-plumber');
var notify     = require("gulp-notify");
var plumber    = require('gulp-plumber');
var livereload = require('gulp-livereload');
var connect    = require('gulp-connect');
var protractor = require("gulp-protractor").protractor;


var paths = {
  sass:           ['./scss/**/*.scss'],
  coffee:         ['./coffee/**/*.coffee'],
  specs_coffee:   ['./specs/**/*.coffee'],
  specs:          ['./specs/*.js'],
  views:          ['./www/index.html', './www/partials/*.html']
};

gulp.task('connect', function() {
  connect.server({
    livereload: true,
    root: 'www'
  });
});

/* This server is used by the testing suites */
gulp.task('testing_connect', function() {
  connect.server({
    livereload: false,
    root: 'www',
    port: 8033
  });
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(connect.reload())
    .on('end', done);
});

gulp.task('coffee', function(){
  gulp.src(paths.coffee)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(coffee())
      .on('error', gutil.log)
      .on('error', gutil.beep)
    .pipe(connect.reload())
    .pipe(gulp.dest('./www/js'));
});

gulp.task('specs_coffee', function(){
  gulp.src(paths.specs_coffee)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(coffee())
      .on('error', gutil.log)
      .on('error', gutil.beep)
    .pipe(gulp.dest('./specs'));
});

gulp.task('spec', function(){
  gulp.src(paths.specs)
      .pipe(protractor({
          configFile: "./protractor.js"
      }))
      .on('error', function(e) { throw e; });
});

gulp.task('views', function(){
  gulp.src(paths.views)
      .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.coffee, ['coffee']);
  gulp.watch(paths.specs_coffee, ['specs_coffee']);
  gulp.watch(paths.views, ['views'])
});

gulp.task('dev', ['sass', 'coffee', 'specs_coffee', 'watch', 'testing_connect', 'connect' ]);
