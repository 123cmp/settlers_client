var gulp = require("gulp"),
    babel = require("gulp-babel"),
    os = require('os'),
    browserSync = require('browser-sync').create(),
    opn = require('opn');

gulp.task("compile", function () {
    gulp.src("src/**/*.html")
        .pipe(gulp.dest("build"));
    return gulp.src("src/**/*.js")
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest("build"));
});

gulp.task('start', ['compile'], function () {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});


gulp.task('build', ['start']);

gulp.task('default', ['build']);

