var gulp 		= require('gulp');
var sass		= require('gulp-ruby-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('sass', function() {
	return sass('scss/*.scss')
				.pipe(gulp.dest('app/css'))
				.pipe(reload({ stream:true }));
});

// Static server + watching scss/html files
gulp.task('serve', ['sass'], function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	});
	
	gulp.watch("app/scss/css_builder.scss", ['sass']);
	gulp.watch("app/*.html").on('change', browserSync.reload);
});


gulp.task('default', ['serve']);

