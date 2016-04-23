var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	connect = require('gulp-connect'),
	open = require('gulp-open'),
	prettify = require('gulp-prettify');

gulp.task('styles', function(){
	console.log("hello");
});

/*gulp.task('open', function(){
	gulp.src('src/index.html')
	.pipe(open());
});*/

gulp.task('app', function(){
  var options = {
    uri: 'http://localhost:8000',
    app: 'chrome'
  };
  gulp.src(__filename)
  .pipe(open(options));
});

gulp.task('scripts', function(){
	gulp.src('src/app/**/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('minjs'))
});


gulp.task('js', function(){
	gulp.src('src/**/*.js')
	.pipe(connect.reload())
});

gulp.task('css', function(){
	gulp.src('src/css/*.css')
	.pipe(connect.reload())
});

gulp.task('html', function(){
	gulp.src('src/**/*.html')
	.pipe(connect.reload())
});

gulp.task('watch', function(){
	gulp.watch('src/**/*.html', ['html']);
	gulp.watch('src/app/**/*.js', ['js']);
	gulp.watch('src/css/*.css', ['css']);
});

gulp.task('connect', function(){
	connect.server({
		root: 'src',
		port:3000,
		livereload: true
	})
});

gulp.task('prettify', function() {
  gulp.src('src/*.html')
    .pipe(prettify({indent_size: 3}))
    .pipe(gulp.dest('dist'))
});

gulp.task('open', ['app']);
gulp.task('default' , ['connect','watch']);