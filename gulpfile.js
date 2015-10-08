var gulp 		= require('gulp');
var sass		= require('gulp-ruby-sass');
var concat		= require('gulp-concat');
var browserSync = require('browser-sync').create();
var reload 		= browserSync.reload;
var debug 		= require('gulp-debug');
// var uglify		= require('gulp-uglify');

gulp.task('sass', function() {
	return sass('./app/src/scss/css_builder.scss')
				.pipe(gulp.dest('app/dist'))
				.pipe(reload({ stream:true }));
});


gulp.task('scripts', function() {
	return gulp.src([
		'app/src/js/bower_components/flot/jquery.js',
		'app/src/js/bower_components/flot/jquery.flot.js',
		'app/src/js/bower_components/flot/jquery.flot.*.js',
		'app/src/js/bower_components/flot.curvedlines/curvedLines.js',
		'app/src/js/flotanimator/jquery.flot.animator.js',
		'app/src/js/flot.js',
		'app/src/js/dashboard.js'])
		.pipe(debug({title : 'unicorn'}))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('app/dist'));
});

gulp.task('serve', ['sass', 'scripts'], function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		ghostMode: { scroll: false }
	});

	gulp.watch('app/src/scss/*.scss', ['sass']);
	gulp.watch('app/src/js/**/*.js', ['scripts']);
	gulp.watch(['dist/*.html', 'dist/*.css', 'dist/*.js'], {cwd: 'app'}, reload);
});

gulp.task('ghostMode');
gulp.task('default', ['serve']);
