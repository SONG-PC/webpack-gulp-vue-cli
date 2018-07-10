var gulp = require('gulp')//gulp�����
var htmlmin = require('gulp-htmlmin')//htmlѹ�����
var gulpRemoveHtml = require('gulp-remove-html')//��ǩ�Ƴ�
var gulpCleanCss = require('gulp-clean-css')//ѹ��cssΪһ��
var rev = require('gulp-rev')//���ļ�����MD5��׺
var revCollector = require('gulp-rev-collector')//·���滻
var removeEmptyLines = require('gulp-remove-empty-lines')//����հ���
var uglify = require('gulp-uglify')//js�ļ�ѹ��
var concat = require('gulp-concat')//����ļ��ϲ�Ϊһ��
var replace = require('gulp-replace')//�ļ����滻
var gulpSequence = require('gulp-sequence')//ͬ��ִ��
var gulpLess = require('gulp-less')
var clean = require('gulp-clean')//����ļ����
var imagemin = require('gulp-imagemin')//ѹ��ͼƬ
 
var buildBasePath = 'dist/' //�������Ŀ¼
 
//ɾ��dist�ļ�
gulp.task('clean', function () {
    return gulp.src(buildBasePath, { read: false })
        .pipe(clean())
})
 
//�����ļ���
gulp.task('copy', function () {
    return gulp.src('app/*.css')
        .pipe(gulp.dest(buildBasePath + 'plugins'))
})
gulp.task('copyimg', function () {
    //�������ִ����md5��Դ�ļ�img����ô�ⲽ����ʡ��
    return gulp.src('app/*.jpg')
        .pipe(gulp.dest(buildBasePath + 'img'));
});
 
//HTMLѹ��
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//���HTMLע��
        collapseWhitespace: false,//ѹ��HTML
        collapseBooleanAttributes: true,//ʡ�Բ������Ե�ֵ <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//ɾ�����пո�������ֵ <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//ɾ��<script>��type="text/javascript"
        removeStyleLinkTypeAttributes: true,//ɾ��<style>��<link>��type="text/css"
        minifyJS: true,//ѹ��ҳ��JS
        minifyCSS: true//ѹ��ҳ��CSS
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
 
//�ϲ�js��css�ļ�֮��ѹ������
//JS�ļ�ѹ��
gulp.task('uglify', function () {
    return gulp.src('app/*.js')
        .pipe(concat('build.js'))//�ϲ���һ��js
        .pipe(gulp.dest(buildBasePath + 'js'))//�����jsĿ¼
        .pipe(uglify())//ѹ����һ��
        .pipe(concat('build.min.js'))//ѹ�����js
        .pipe(gulp.dest(buildBasePath + 'js'))//�����JsĿ¼
})
 
//jsmd5��ѹ������md5��������������ʹ��revCollector����·���滻
gulp.task('minifyjsmd5', function () {
    return gulp.src('app/*.js')
        .pipe(concat('build.min.js'))//ѹ�����Js
        .pipe(uglify())//ѹ��js��һ��
        .pipe(rev())//�ļ�����MD5��׺
        .pipe(gulp.dest(buildBasePath + 'js'))//�����jsĿ¼
        .pipe(rev.manifest('rev-js-manifest.json'))//����һ��rev-manifest.json
        .pipe(gulp.dest('rev'))
})
 
//css
gulp.task('minifycss', function () {
    return gulp.src('app/*.css')
        .pipe(concat('build.css'))//�ϵ�һ��css
        .pipe(gulp.dest(buildBasePath + 'css'))
        .pipe(gulpCleanCss())//ѹ��css��һ��
        .pipe(concat('build.min.css'))//ѹ�����css
        .pipe(gulp.dest(buildBasePath + 'css'))
})
 
//cssmd5,ѹ������md5��������������ʹ��revCollector����·���滻
gulp.task('minifycssmd5', function () {
    return gulp.src('app/*.css')
        .pipe(concat('build.min.css'))//ѹ�����css
        .pipe(gulpCleanCss())
        .pipe(rev())//�ļ�����MD5��׺
        .pipe(gulp.dest(buildBasePath + 'css'))
        .pipe(rev.manifest('rev-css-manifest.json'))//����һ��rev-manifest.json
        .pipe(gulp.dest('rev'))//��rev-manifest.json���浽revĿ¼��
})
 
//imgmd5,ѹ������md5��������������ʹ��revCollector����·���滻
gulp.task('minifyimgmd5', function () {
    return gulp.src(['app/*.jpg', 'app/*.png', 'app/*.gif'])
        .pipe(rev())//�ļ��������md5��׺
        .pipe(gulp.dest(buildBasePath + 'img'))
        .pipe(rev.manifest('rev-img-manifest.json'))
        .pipe(gulp.dest('rev'))
})
 
//����ʹ�ã��滻�ļ�����common.js�滻Ϊbuild.min.js
gulp.task('replacejs', function () {
    return gulp.src([buildBasePath + '*.html'])
        .pipe(replace('common.js', 'build.min.js'))
        .pipe(gulp.dest(buildBasePath))
})
 
//����ʹ�ã��滻�ļ���,common.css�滻Ϊbuild.min.css
gulp.task('replacecss', function () {
    return gulp.src([buildBasePath + '*.html'])
        .pipe(replace('style.css', 'build.min.css'))
        .pipe(gulp.dest(buildBasePath))
})
 
//����ʹ�ã��滻�ļ�����common.js�滻Ϊbuild.js
gulp.task('replacejsDev', function () {
    return gulp.src([buildBasePath + '*.html'])
        .pipe(replace('common.js', 'build.js'))
        .pipe(gulp.dest(buildBasePath))
})
 
//����ʹ�ã��滻�ļ�����common.css�滻Ϊbuild.css
gulp.task('replacecssDev', function () {
    return gulp.src([buildBasePath + '*.html'])
        .pipe(replace('style.css', 'build.css'))
        .pipe(gulp.dest(buildBasePath))
})
 

 
gulp.task('revimg', function () {
    //css����Ҫ���img�滻
    return gulp.src(['rev/**/rev-img-manifest.json', buildBasePath + 'css/*.css'])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(gulp.dest(buildBasePath + 'css'))
})
 
//�����ļ��ı仯�����޸�ʱ���Զ�����defautdevȱʡĬ������
gulp.task('watch', function () {
    gulp.watch('**/*.html', ['default']);
});
//�����ļ��ı仯�����޸�ʱ���Զ�����default2ȱʡĬ������
gulp.task('watch2', function () {
    gulp.watch('**/*.html', ['default2']);
});
//�����ļ��ı仯�����޸�ʱ���Զ�����defaultdevȱʡĬ������
gulp.task('watchdev', function () {
    gulp.watch('**/*.html', ['defaultdev']);
});
 
gulp.task('default', function (cb) { gulpSequence('clean', 'copy', 'minifyjsmd5', 'minifycssmd5', 'minifyimgmd5', 'htmlmin', 'replacejs', 'replacecss', 'rev', 'revimg')(cb); });
 
gulp.task('default2', function (cb) { gulpSequence('clean', 'copy', 'copyimg', 'uglify', 'minifycss', 'htmlmin', 'replacejs', 'replacecss')(cb); });
 
gulp.task('defaultdev', function (cb) { gulpSequence('clean', 'copy', 'copyimg', 'uglify', 'minifycss', 'htmlmin', 'replacejsdev', 'replacecssdev')(cb); });