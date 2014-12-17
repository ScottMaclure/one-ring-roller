var gulp = require('gulp');
var gulpif = require('gulp-if');
var sprite = require('css-sprite').stream;

var SPRITE_DEST_DIR = 'public/sprites';

// generate sprite.png and _sprite.scss
gulp.task('sprites-dice', function () {
  return gulp.src('images/dice/*.png')
	.pipe(sprite({
		name: 'sprite-dice',
		style: 'sprite-dice.css',
		cssPath: '',
		processor: 'css',
		prefix: 'dice'
	}))
	.pipe(gulpif('*.png', gulp.dest('public/orr'), gulp.dest('public/orr')))
});

gulp.task('copy-deps', function () {
	return gulp.src([
		'bower_components/barekit/css/barekit.css',
		'bower_components/barekit/js/barekit.min.js',
		'bower_components/jquery-serialize-object/dist/jquery.serialize-object.min.js'
	])
	.pipe(gulp.dest('public/deps'));
});

gulp.task('default', ['sprites-dice', 'copy-deps'], function() {
	console.log('Default task running.');
});