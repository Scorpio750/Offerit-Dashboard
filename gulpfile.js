var gulp 		= require('gulp'),
	sass		= require('gulp-ruby-sass'),
	concat		= require('gulp-concat'),
	browserSync = require('browser-sync').create(),
	reload 		= browserSync.reload,
	debug 		= require('gulp-debug'),
	uglify		= require('gulp-uglify'),
	notify 		= require('gulp-notify'),
	bower		= require('gulp-bower');
	autoprefixer= require('gulp-autoprefixer');

var config = {
	sassPath: './app/src/scss',
	bowerDir: 'bower_components'
}

// runs bower install
gulp.task('bower', function() {
	return bower()
		.pipe(gulp.dest(config.bowerDir))
});

// move fonts into dist directory
gulp.task('icons', function() {
	return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
		.pipe(gulp.dest('app/dist/fonts'));
});

// sets up sass, links bootstrap and fontawesome into path for access
gulp.task('sass', function() {
	return sass(config.sassPath + '/css_builder.scss', {
			loadPath: [
				config.sassPath,
				config.bowerDir + '/bootstrap-sass/assets/stylesheets',
				config.bowerDir + '/fontawesome/scss'
				]
			})
			.on('error', notify.onError(function (error) {
				return 'Error: ' + error.message;
				}))
		.pipe(gulp.dest('app/dist/css'))
		.pipe(reload({ stream:true }));
});

// concatenates all js scripts into one file
gulp.task('scripts', function() {
	return gulp.src([
			config.bowerDir + '/flot/jquery.js',
			config.bowerDir + '/flot/jquery.flot.js',
			config.bowerDir + '/flot/jquery.flot.*.js',
			config.bowerDir + '/flot.curvedlines/curvedLines.js',
			'app/src/js/flotanimator/jquery.flot.animator.js',
			'app/src/js/flot.js',
			'app/src/js/dashboard.js'])
		.pipe(debug({title : 'js-scripts'}))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('app/dist/js'));
});

gulp.task('serve', ['sass', 'scripts', 'icons'], function() {
	browserSync.init({
		server: {
			baseDir: 'app',
		},
		startPath: '/dist/dashboard-flat.html',
		ghostMode: { scroll: false }
	});

	gulp.watch(config.sassPath + '/*.scss', ['sass']);
	gulp.watch('app/src/js/**/*.js', ['scripts']);
	gulp.watch(['dist/*.html', 'dist/css/*.css', 'dist/js/*.js'], {cwd: 'app'}, reload);
});

	gulp.task('ghostMode');
	gulp.task('default', ['serve']);
