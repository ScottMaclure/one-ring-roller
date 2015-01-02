var gulp = require('gulp');
var gulpif = require('gulp-if');
var sprite = require('css-sprite').stream;
var del = require('del');
var runSequence = require('run-sequence');

// Scrub public folder every time, get rid of orphaned files.
gulp.task('clean', function (cb) {
  del([
    'public/**',
  ], cb);
});

gulp.task('clean-gh-pages', function (cb) {
  del([
    '../one-ring-roller-gh-pages/**',
    '!../one-ring-roller-gh-pages/.git/**',
    '!../one-ring-roller-gh-pages/.git',
    '!../one-ring-roller-gh-pages',
  ], { force: true }, cb);
});

gulp.task('copy-source-assets', function () {
	return gulp.src([
		'source/favicon.ico',
		'source/index.html',
		// All files in here get copied, for now.
		'source/orr/',
	])
	.pipe(gulp.dest('public/'))
});

gulp.task('copy-source-code', function () {
	return gulp.src([
		'source/orr/**/*',
	], { base: 'source' })
	.pipe(gulp.dest('public/'))
});

gulp.task('copy-deps', function () {
	return gulp.src([
		'bower_components/barekit/css/barekit.css',
		'bower_components/barekit/js/barekit.min.js',
		'bower_components/angular/angular.min.js',
		'bower_components/angular/angular.min.js.map'
	])
	.pipe(gulp.dest('public/deps'));
});

// generate sprite.png and _sprite.scss
gulp.task('sprites-dice', function () {
  return gulp.src('source/images/dice/*.png')
	.pipe(sprite({
		name: 'sprite-dice',
		style: 'sprite-dice.css',
		cssPath: '',
		processor: 'css',
		prefix: 'dice'
	}))
	.pipe(gulpif('*.png', gulp.dest('public/orr'), gulp.dest('public/orr')))
});

// Used for "publishing" to live. Requires manual steps in CLI afterwards.
gulp.task('gh-pages', [ 'build', 'clean-gh-pages' ], function () {
	return gulp.src('public/**/*')
	.pipe(gulp.dest('../one-ring-roller-gh-pages'));
});

gulp.task('build', function(callback) {
	runSequence(
		'clean',
		[
			'copy-source-assets',
			'copy-source-code',
			'sprites-dice',
			'copy-deps'
		],
		callback
	);
});

// TODO How about a watch task?
gulp.task('default', ['build']);