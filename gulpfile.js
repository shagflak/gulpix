var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var glob  = require('glob');//changed from require-globify
var webserver = require('gulp-webserver');

var files = glob.sync('app/**/*.js');

function compileScripts(watch) {

  var bundler = watchify(
      browserify({ entries: files, debug: true }).transform(babel, { presets: ["es2015", "react"] })
  );

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./.tmp'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

//Tasks
gulp.task('build', function() { return compileScripts(); });
gulp.task('watch', function() {
    var isWatch = true;//used just to rebundle the js to the tmp folder
    gulp.watch('app/**/*.js', compileScripts(isWatch) );
});

gulp.task('webserver', function() {
gulp.src('./app')
    .pipe(webserver({
        livereload: {
            enable: true,// need this set to true to enable livereload
        },
        fallback: 'index.html',//use html5Mode for my single page app with this plugin
        directoryListing: {
            enable: false,
            path: 'app'
        },
        open: true,
        host: 'localhost',
        port: 9000
    }));
});

gulp.task('default', ['watch','webserver']);
