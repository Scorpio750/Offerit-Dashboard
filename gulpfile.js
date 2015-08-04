var gulp 		= require('gulp'),
	sass		= require('gulp-ruby-sass'),
	concat		= require('gulp-concat'),
	browserSync = require('browser-sync').create(),
	reload 		= browserSync.reload,
	debug 		= require('gulp-debug'),
	uglify		= require('gulp-uglify'),
	notify 		= require('gulp-notify'),
	bower		= require('gulp-bower'),
	minify_css	= require('gulp-minify-css'),
	autoprefixer= require('gulp-autoprefixer'),
	modernizr	= require('gulp-modernizr'),
	merge		= require('merge2');

var config = {
	sassPath: 'app/src/scss/css_builder.scss',
	normalize: 'bower_components/normalize.css/normalize.css',
	bowerDir: 'bower_components',
	css: 'app/dist/css',
	jsPath: 'app/src/js'
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
	return sass(config.sassPath, {
			loadPath: [
				config.sassPath,
				config.bowerDir + '/bootstrap-sass/assets/stylesheets',
				config.bowerDir + '/fontawesome/scss'
				]
			})
			.on('error', notify.onError(function (error) {
				return 'Error: ' + error.message;
				}))
		.pipe(gulp.dest('app/src/css'))
		.pipe(reload({ stream:true }));
});

// merge css streams
gulp.task('styles', function() {
	return merge(
		gulp.src(config.normalize),
		sass(config.sassPath)
	)
	.pipe(concat('style.css'))
	.pipe(autoprefixer({
		browsers: ['last 2 version'],
		cascade: false
		}))
	.pipe(minify_css())
	.pipe(gulp.dest(config.css));
});

// concatenates all js scripts into one file
gulp.task('scripts', function() {
	return gulp.src([
			config.jsPath + '/literalopen',
			config.bowerDir + '/jquery/dist/jquery.min.js',
			config.bowerDir + '/flot/jquery.flot.js',
			config.bowerDir + '/flot/jquery.flot.*.js',
			config.bowerDir + '/nicescroll/jquery.nicescroll.min.js',	
			config.jsPath + '/flotanimator/jquery.flot.animator.js',
			config.jsPath + '/data_render.js',
			config.jsPath + '/dashboard.js',
			config.jsPath + '/literalclose'	
			])
		.pipe(debug({title : 'js-scripts'}))
		.pipe(concat('app.js'))
		// .pipe(modernizr())
		// .pipe(uglify())
		.pipe(gulp.dest('app/dist/js'));
});

gulp.task('serve', ['styles', 'scripts', 'icons'], function() {
	browserSync.init({
		server: {
			baseDir: 'app',
		},
		startPath: '/dist/dashboard-flat.html',
		ghostMode: { scroll: false }
	});

	gulp.watch(config.sassPath, ['styles']);
	gulp.watch(config.jsPath + '/**/*.js', ['scripts']);
	gulp.watch(['dist/*.html', 'dist/css/*.css', 'dist/js/*.js'], {cwd: 'app'}, reload);
});

	gulp.task('ghostMode');
	gulp.task('default', ['serve']);
