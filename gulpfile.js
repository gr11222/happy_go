var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var jst = require('gulp-cmd-jst');

//html文件编译为js文件
gulp.task('jst', function() {
    gulp.src('html/*.html')
        .pipe(jst(
            {
                templateSettings: {
                  evaluate: /##([\s\S]+?)##/g,
                  interpolate: /\{\{(.+?)\}\}/g,
                  escape: /\{\{\{\{-([\s\S]+?)\}\}\}\}/g
                },
                //filter escape character 
                processContent: function(src) {
                  return src.replace(/(^\s+|\s+$)/gm, '');
                },
                //compress Jst 
                prettify: true, 
                //cmd: true || amd: true         
                cmd: true
            }
        ))
        .pipe( gulp.dest('html/'));
});


//less编译
gulp.task('less',function(){
	return gulp.src('less/*.less')
	           .pipe( less() )
	           .pipe( gulp.dest('css/') )

});

//css的合并和压缩
gulp.task('css',function(){
	return gulp.src('css/*.css')
	           .pipe( cleanCss() )
	           .pipe(autoprefixer({
	                browsers: ['last 20 versions'],
		            cascade: true
	            }))
	           .pipe( concat('app.min.css') )
	           .pipe( gulp.dest('../app/'))
});


//js的合并和压缩
gulp.task('js',function(){
	return gulp.src(['js/*.js'])
	           .pipe( concat('app.min.js'))
	           .pipe( uglify() )
	           .pipe( gulp.dest('../app/'));
});


gulp.task('localhost',function(){
	connect.server({
		root:'./',
		port:8083
	})
});

gulp.task('myWatch',function(){
	gulp.watch(['less/*.less'],['less']);
	gulp.watch('css/*.css',['css']);
	//gulp.watch('html/*.html',['jst']);
});

gulp.task('default',['myWatch','localhost']);




