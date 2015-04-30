// Include gulp
var gulp = require('gulp');
var dest = 'dist/';
// Include plugins
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var notify = require('gulp-notify');

gulp.task('less', function() {
    return gulp.src([
        'less/main.less',
        'less/custom.less'
    ])
            .pipe(less().on("error", notify.onError(function(error) {
        return "Error compiling LESS: " + error.message;
    })))
            .pipe(gulp.dest(dest + 'css'))
            .pipe(rename({suffix: '.min'}))
            .pipe(minifyCSS())
            .pipe(gulp.dest(dest + 'css'));
});

gulp.task('scripts', function() {
    gulp.src([
        'js/plugin/jquery.placeholder.js',
        'js/plugin/bootstrap-dialog.js',
        'js/plugin/jquery.multilevelpushmenu.js',
        'js/plugin/jquery.matchHeight.js',
        'js/plugin/printPage.js',
        'js/plugin/rwdImageMaps.js',
        'js/common.js'
    ])
            .pipe(concat('main.js'))
            .pipe(gulp.dest(dest + 'js'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify().on("error", notify.onError(function(error) {
        return "Error compiling JavaScript: " + error.message;
    })))
            .pipe(gulp.dest(dest + 'js'));
    gulp.src([
        'js/map/states.js',
        'js/map/embed.js'
    ])
            .pipe(concat('map.js'))
            .pipe(gulp.dest(dest + 'js'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify().on("error", notify.onError(function(error) {
        return "Error compiling JavaScript: " + error.message;
    })))
            .pipe(gulp.dest(dest + 'js'));
});
// Compile CSS from Sass files
gulp.task('images', function() {
    return gulp.src('images/**/*')
            .pipe(cache(imagemin({optimizationLevel: 5, progressive: true, interlaced: true})))
            .pipe(gulp.dest(dest + 'images'));
});
// Watch for changes in files
gulp.task('watch', function() {
    // Watch .less files
    gulp.watch('less/*.less', ['less']);
    // Watch .js files
    gulp.watch('js/**/*.js', ['scripts']);
    // Watch image files
    gulp.watch('images/**/*', ['images']);
});
// Default Task
gulp.task('default', ['less', 'scripts', 'images', 'watch']);