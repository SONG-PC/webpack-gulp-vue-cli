var gulp = require('gulp')//gulp主组件
var htmlmin = require('gulp-htmlmin')//html压缩组件
var gulpRemoveHtml = require('gulp-remove-html')//标签移除
var gulpCleanCss = require('gulp-clean-css')//压缩css为一行
var rev = require('gulp-rev')//对文件名加MD5后缀
var revCollector = require('gulp-rev-collector')//路径替换
var removeEmptyLines = require('gulp-remove-empty-lines')//清除空白行
var uglify = require('gulp-uglify')//js文件压缩
var concat = require('gulp-concat')//多个文件合并为一个
var replace = require('gulp-replace')//文件名替换
var gulpSequence = require('gulp-sequence')//同步执行
var gulpLess = require('gulp-less')
var clean = require('gulp-clean')//清除文件插件
var imagemin = require('gulp-imagemin')//压缩图片
 
var buildBasePath = 'dist/' //构建输出目录
 
//删除dist文件
gulp.task('clean', function () {
    return gulp.src(buildBasePath, { read: false })
        .pipe(clean())
})
 
//复制文件夹
gulp.task('copy', function () {
    return gulp.src('app/*.css')
        .pipe(gulp.dest(buildBasePath + 'plugins'))
})
gulp.task('copyimg', function () {
    //如果下面执行了md5资源文件img，那么这步可以省略
    return gulp.src('app/*.jpg')
        .pipe(gulp.dest(buildBasePath + 'img'));
});
 
//HTML压缩
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: false,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    }
    return gulp.src('app/*.html')
        .pipe(gulpRemoveHtml())
        .pipe(removeEmptyLines())
        .pipe(htmlmin(options))
        .pipe(gulp.dest(buildBasePath))
})
 
 
gulp.task('gulpLess', function () {
    return gulp.src('app/*.less')
        .pipe(gulpLess())
        .pipe(gulp.dest('src/css'))
})
 
//合并js、css文件之后压缩代码
//JS文件压缩
gulp.task('uglify', function () {
    return gulp.src('app/*.js')
        .pipe(concat('build.js'))//合并到一个js
        .pipe(gulp.dest(buildBasePath + 'js'))//输出到js目录
        .pipe(uglify())//压缩到一行
        .pipe(concat('build.min.js'))//压缩后的js
        .pipe(gulp.dest(buildBasePath + 'js'))//输出到Js目录
})
 
//jsmd5，压缩后并用md5进行命名，下面使用revCollector进行路径替换
gulp.task('minifyjsmd5', function () {
    return gulp.src('app/*.js')
        .pipe(concat('build.min.js'))//压缩后的Js
        .pipe(uglify())//压缩js到一行
        .pipe(rev())//文件名加MD5后缀
        .pipe(gulp.dest(buildBasePath + 'js'))//输出到js目录
        .pipe(rev.manifest('rev-js-manifest.json'))//生成一个rev-manifest.json
        .pipe(gulp.dest('rev'))
})
 
//css
gulp.task('minifycss', function () {
    return gulp.src('app/*.css')
        .pipe(concat('build.css'))//合到一个css
        .pipe(gulp.dest(buildBasePath + 'css'))
        .pipe(gulpCleanCss())//压缩css到一行
        .pipe(concat('build.min.css'))//压缩后的css
        .pipe(gulp.dest(buildBasePath + 'css'))
})
 
//cssmd5,压缩后并用md5进行命名，下面使用revCollector进行路径替换
gulp.task('minifycssmd5', function () {
    return gulp.src('app/*.css')
        .pipe(concat('build.min.css'))//压缩后的css
        .pipe(gulpCleanCss())
        .pipe(rev())//文件名加MD5后缀
        .pipe(gulp.dest(buildBasePath + 'css'))
        .pipe(rev.manifest('rev-css-manifest.json'))//生成一个rev-manifest.json
        .pipe(gulp.dest('rev'))//将rev-manifest.json保存到rev目录内
})
 
//imgmd5,压缩后并用md5进行命名，下面使用revCollector进行路径替换
gulp.task('minifyimgmd5', function () {
    return gulp.src(['app/*.jpg', 'app/*.png', 'app/*.gif'])
        .pipe(rev())//文件名后面加md5后缀
        .pipe(gulp.dest(buildBasePath + 'img'))
        .pipe(rev.manifest('rev-img-manifest.json'))
        .pipe(gulp.dest('rev'))
})
 
//生产使用，替换文件名，common.js替换为build.min.js
gulp.task('replacejs', function () {
    return gulp.src([buildBasePath + '*.html'])
        .pipe(replace('common.js', 'build.min.js'))
        .pipe(gulp.dest(buildBasePath))
})
 
//生产使用，替换文件名,common.css替换为build.min.css
gulp.task('replacecss', function () {
    return gulp.src([buildBasePath + '*.html'])
        .pipe(replace('style.css', 'build.min.css'))
        .pipe(gulp.dest(buildBasePath))
})
 
//开发使用，替换文件名，common.js替换为build.js
gulp.task('replacejsDev', function () {
    return gulp.src([buildBasePath + '*.html'])
        .pipe(replace('common.js', 'build.js'))
        .pipe(gulp.dest(buildBasePath))
})
 
//开发使用，替换文件名，common.css替换为build.css
gulp.task('replacecssDev', function () {
    return gulp.src([buildBasePath + '*.html'])
        .pipe(replace('style.css', 'build.css'))
        .pipe(gulp.dest(buildBasePath))
})
 

 
gulp.task('revimg', function () {
    //css，主要针对img替换
    return gulp.src(['rev/**/rev-img-manifest.json', buildBasePath + 'css/*.css'])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(gulp.dest(buildBasePath + 'css'))
})
 
//监视文件的变化，有修改时，自动调用defautdev缺省默认任务
gulp.task('watch', function () {
    gulp.watch('**/*.html', ['default']);
});
//监视文件的变化，有修改时，自动调用default2缺省默认任务
gulp.task('watch2', function () {
    gulp.watch('**/*.html', ['default2']);
});
//监视文件的变化，有修改时，自动调用defaultdev缺省默认任务
gulp.task('watchdev', function () {
    gulp.watch('**/*.html', ['defaultdev']);
});
 
gulp.task('default', function (cb) { gulpSequence('clean', 'copy', 'minifyjsmd5', 'minifycssmd5', 'minifyimgmd5', 'htmlmin', 'replacejs', 'replacecss', 'rev', 'revimg')(cb); });
 
gulp.task('default2', function (cb) { gulpSequence('clean', 'copy', 'copyimg', 'uglify', 'minifycss', 'htmlmin', 'replacejs', 'replacecss')(cb); });
 
gulp.task('defaultdev', function (cb) { gulpSequence('clean', 'copy', 'copyimg', 'uglify', 'minifycss', 'htmlmin', 'replacejsdev', 'replacecssdev')(cb); });