// Include gulp
var gulp = require('gulp');
var dest = '../pwna_assets/';
// Include plugins
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cache = require('gulp-cache');
var notify = require('gulp-notify');
var xlsxj = require("xlsx-to-json");

gulp.task('less', function() {
    return gulp.src([
        'less/main.less',
        'less/custom.less',
        'less/custom-aief.less',
        'less/custom-npra.less',
        'less/custom-swra.less',
        'less/custom-rar.less'
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
        'js/plugin/conformity.js',
//        'js/plugin/jquery.matchHeight.js',
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
        'js/map/progressBar.js',
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


gulp.task('map_json', function() {
    xlsxj({
        input: "js/map/PWNA MAP Information.xlsx", // input xls 
        output: dest + "js/locations.json"
    }, function(err, result) {
        if (err) {
            console.error(err);
        } else {
            //console.log(result);
        }
    });
});
// Watch for changes in files
gulp.task('watch', function() {
    // Watch .less files
    gulp.watch('less/*.less', ['less']);
    // Watch .js files
    gulp.watch('js/**/*.js', ['scripts']);
});
// Default Task
gulp.task('default', ['less', 'scripts', 'map_json', 'watch']);