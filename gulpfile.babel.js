import gulp from 'gulp';
import sass from 'gulp-sass';
import sync from 'browser-sync';
import babel from 'gulp-babel';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import util from 'gulp-util';
import prefix from 'gulp-autoprefixer';
import minify from 'gulp-minify-css';
import concat from 'gulp-concat';
import rename from 'gulp-rename';


// configuration files
let config = {
    assetsDir: 'app/Resources/assets',
    sassPattern: 'sass/**/*.scss',
    production: !!util.env.production
};


// gulp.task('task-name', callback)
gulp.task('sass', () => {
    return gulp.src('src/sass/**/*.sass')
        .pipe(sass())
        .pipe(config.production ? minifyCSS() : util.noop())
        .pipe(prefix('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(sync.reload({
            stream: true
        }))
});


// Prepare ES6/JSX files for browser
gulp.task('transpile', () => {
    return browserify({entries: './src/js/app.js', debug: true})
        .transform("babelify", { presets: ["es2015", "react"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(config.production ? sourcemaps.init() : util.noop())
        .pipe(config.production ? uglify() : util.noop())
        .pipe(config.production ? sourcemaps.write('./maps') : util.noop())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(sync.reload({
            stream: true
        }))
});


// Configure Auto Reload of Browser
gulp.task('sync', () => {
    sync.init({
        server: {
            baseDir: 'dist'
        }
    });
});



// watching multiple files with a task 'watch'
gulp.task('default', ['sync', 'sass', 'transpile'], () => {
    // gulp.watch('filepath/pattern', ['all', 'tasknames', 'here'])
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/js/**/app.js', ['transpile']);
    gulp.watch('dist/html/**/*.html', sync.reload);
    gulp.watch('dist/index.html', sync.reload);
});