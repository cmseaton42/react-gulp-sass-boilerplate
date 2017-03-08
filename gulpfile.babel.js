import gulp from 'gulp';
import sass from 'gulp-sass';
import sync from 'browser-sync';
import babelify from 'babelify';
import browserify from 'browserify';
import watchify from 'watchify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import util from 'gulp-util';
import merge from 'utils-merge';
import prefix from 'gulp-autoprefixer';
import minify from 'gulp-minify-css';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import chalk from 'chalk';


// configuration object
let config = {
    sassPattern: 'src/sass/**/*.sass',
    production: !!util.env.production
};

// gulp.task('task-name', callback)
gulp.task('sass', () => {
    return gulp.src(config.sassPattern)
        .pipe(sass())
        .pipe(config.production ? minifyCSS() : util.noop())
        .pipe(prefix('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(sync.reload({
            stream: true
        }))
});


function map_error(err) {
  if (err.fileName) {
    // regular error
    util.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
      + ': '
      + 'Line '
      + chalk.magenta(err.lineNumber)
      + ' & '
      + 'Column '
      + chalk.magenta(err.columnNumber || err.column)
      + ': '
      + chalk.blue(err.description))
  } else {
    // browserify error..
    util.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message))
  }

  this.emit('end')
}

gulp.task('watchify', () => {
  let args = merge(watchify.args, { debug: true })
  let bundler = watchify(browserify('./src/js/app.js', args)).transform(babelify, { presets: ["es2015", "react"] })
  bundle(bundler)

  bundler.on('update', () => {
    bundle(bundler)
  })
})


// Without watchify
gulp.task('browserify', () => {
  let bundler = browserify('./src/js/app.js', { debug: true }).transform(babelify, { presets: ["es2015", "react"] })

  return bundle(bundler)
}) 

function bundle(bundler) {
  return bundler.bundle()
    .on('error', map_error)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
      // capture sourcemaps from transforms
      .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(sync.reload({
            stream: true
    }))
}


// Configure Auto Reload of Browser
gulp.task('sync', () => {
    sync.init({
        server: {
            baseDir: 'dist'
        }
    });
});


// watching multiple files with a task 'watch'
gulp.task('default', ['sync', 'sass'], () => {
    // gulp.watch('filepath/pattern', ['all', 'tasknames', 'here'])
    gulp.watch(config.sassPattern, ['sass']);
    if(config.production){
        gulp.watch('src/js/**/app.js', ['browserify']);
    } else {
        gulp.watch('src/js/**/app.js', ['watchify']);
    }
    
    gulp.watch('dist/html/**/*.html', sync.reload);
    gulp.watch('dist/index.html', sync.reload);
});