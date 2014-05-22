var gulp      = require('gulp');
var concat    = require('gulp-concat');
var sass      = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename    = require('gulp-rename');
var coffee    = require('gulp-coffee');

var paths = {
  sass: ['./scss/**/*.scss'],
  coffee: ['./coffee/**/*.coffee']
};

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('coffee', function(){
  gulp.src(paths.coffee)
    .pipe(coffee())
    .pipe(gulp.dest('./www/js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.coffee, ['coffee']);
});

gulp.task('default', ['sass', 'coffee', 'watch']);
