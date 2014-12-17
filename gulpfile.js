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
		cssPath: 'sprites',
		processor: 'css',
		prefix: 'dice'
	}))
	.pipe(gulpif('*.png', gulp.dest('public/sprites'), gulp.dest('public/stylesheets')))
});

gulp.task('copy-barekit', function () {

	return gulp.src([
		'bower_components/barekit/css/barekit.css',
		'bower_components/barekit/js/barekit.min.js'
	])
	.pipe(gulp.dest('public/barekit'));

});

gulp.task('default', ['sprites-dice', 'copy-barekit'], function() {
	console.log('Default task running.');
});