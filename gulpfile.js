const gulp = require('gulp');
const babel = require('gulp-babel');
const less = require('gulp-less');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const autoPrefixer = require('gulp-autoprefixer');
const spritesmith = require('gulp.spritesmith');
const eslint = require('gulp-eslint');
const connect = require('gulp-connect');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const opn = require('opn');
const del = require('del');
const order = require('gulp-order');

gulp.task('connect', () => {
	connect.server({
		name: 'dev',
		root: ['demo', 'bower_components'],
		port: 8080,
		livereload: true,
	});
});

gulp.task('watch', ['js', 'less', 'sprite'], () => {
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('src/less/*.less', ['less']);
	gulp.watch('src/img/*.png', ['sprite']);
	gulp.watch('demo/**', ['liveload']);
});

gulp.task('liveload', () => {
	gulp.src('demo/**')
		.pipe(connect.reload());
});

gulp.task('js', ['lint'], () => {
	gulp.src('src/js/*.js')
		.pipe(plumber())
		.pipe(order([
			'list.js',
			'wmplayer.js',
			'main.js',
		]))
		.pipe(concat('app.js'))
		.pipe(babel({
			presets: ['es2015'],
		}))
		.pipe(uglify())
		.pipe(gulp.dest('demo/static/js'));
});

gulp.task('lint', () => {
	gulp.src('src/js/*.js')
		.pipe(eslint({
			configFile: '.eslintrc'
		}))
		.pipe(eslint.format());
});

gulp.task('less', () => {
	gulp.src('src/less/*.less')
		.pipe(less())
		.pipe(concat('main.css'))
		.pipe(autoPrefixer({
			browsers: ['chrome >= 20', 'ie > 8', 'firefox >= 20', 'android >= 2.3']
		}))
		.pipe(cleanCss())
		.pipe(gulp.dest('demo/static/css'));
});

gulp.task('default', ['watch', 'connect'], () => {
	opn('http://localhost:8080');
});

gulp.task('sprite', () => {
	let spriteData = gulp.src('src/img/*.png')
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.less',
			imgPath: '../img/sprite.png'
		}));
	spriteData.css
		.pipe(gulp.dest('src/less/'));
	spriteData.img
		.pipe(gulp.dest('demo/static/img/'));
});

gulp.task('build', () => {

});