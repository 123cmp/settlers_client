var gulp = require("gulp"),
    os = require('os'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean');
//
//gulp.task("clean", function() {
//    gulp.src('build/**/*')
//        .pipe(clean({force: true}));
//});

gulp.task("sass", function() {
    gulp.src('src/style/main.scss')
        .pipe(watch('src/style/*'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/style/'));

});

gulp.task("compile", function () {
    gulp.src("src/**/*.html")
        .pipe(gulp.dest("build"));
    gulp.src("bower_components/**/*")
        .pipe(gulp.dest("build"));
    return gulp.src("src/**/*.js")
        .pipe(gulp.dest("build"));
});

gulp.task('start', ['compile', 'sass'], function () {

    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('src/style/*', ['sass']);
    gulp.watch('src/**/*.html', ['compile']);
    gulp.watch('src/**/*.js', ['compile']);

});

gulp.task('build', ['start'], function() {
    gulp.start('watch');
});

gulp.task('local', function() {
    gulp.src('src/style/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/style/'));

    gulp.src("bower_components/**/*")
        .pipe(gulp.dest("src/bower_components/"));

    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    });
});

gulp.task('default', ['build']);

