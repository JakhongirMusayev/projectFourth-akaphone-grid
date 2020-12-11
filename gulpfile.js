const gulp = require('gulp');
const rm = require('gulp-rm');
const pug = require('gulp-pug')
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', () => {
	return gulp.src('build/**/*', { read: false })
		.pipe(rm());
});

gulp.task('pug', () => {
	return gulp.src('src/pug/index.pug')
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }));
});
gulp.task('scss', () => {
	return gulp.src('src/scss/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ['last 2 versions'],
			cascade: true
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('copy:images', () => {
	return gulp.src('./src/images/**/*.*')
		.pipe(gulp.dest('./build/images/'))
});

gulp.task('copy:fonts', () => {
	return gulp.src('./src/fonts/**/*.*')
		.pipe(gulp.dest('./build/fonts/'))
});

gulp.task('server', () => {
	browserSync.init({
		server: {
			baseDir: './build'
		}
	});
});

gulp.watch(
	[
		'./build/index.html',
		'./build/main.css'
	],
	gulp.parallel(browserSync.reload)
);
gulp.watch('./src/pug/**/*.pug', gulp.parallel('pug'));
gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'));
gulp.watch('./src/images/**/*.*', gulp.parallel('copy:images'));
gulp.watch('./src/fonts/**/*.*', gulp.parallel('copy:fonts'));

gulp.task(
	'default',
	gulp.series('clean', gulp.parallel('pug', 'scss', 'copy:fonts', 'copy:images'), 'server')
);
