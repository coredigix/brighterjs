'use strict';

var gulp	= require('gulp');
var minify	= require('gulp-minify');
var include	= require("gulp-include");
var rename	= require("gulp-rename");
var voidLine= require('gulp-remove-empty-lines');

gulp.task('concat', () => {
	return gulp.src('assets/main.js')
		.pipe(include({
			hardFail: true
		}))
		.pipe(rename('brighter.js'))
		.pipe(voidLine())
		// .pipe(minify())
		.pipe(gulp.dest("dist/"));
});


gulp.task('compile', () => {
	return gulp.src('assets/main.js')
		.pipe(include({
			hardFail: true
		}))
		.pipe(rename('brighter.js'))
		.pipe(minify())
		.pipe(gulp.dest("dist/"));
});

gulp.task('default', ['concat'], () => {
	gulp.watch('assets/**/*.js', ['concat']);
});