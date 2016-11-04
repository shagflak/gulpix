var gulp       = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var glob       = require('glob');//changed from require-globify
var webserver  = require('gulp-webserver');
var lazypipe   = require("lazypipe");
var babel      = require('gulp-babel');

var app = {
    paths: {
        scripts : 'app/scripts/**/*.js',
        styles  : 'app/sass/**/*.scss'
    }
};

//Tasks::Prod
gulp.task('build', function() { return compileScripts(); });

gulp.task('dev:watch', function() {
    gulp.watch(app.paths.scripts, ['transpile:client'] ); //changed from  compileScripts(true)
});

//Tasks:dev
//lazy pipes are used when you want to set an order of execution in your pipes if you don't add the lazypipe for the
//transpileClient function it will not execute on the right order (haven't digged depper on this)
//
gulp.task('transpile:client', function() {
    return  gulp.src(app.paths.scripts)
            .pipe(babel({
                presets: ['es2015','react']
            }))
            .pipe(gulp.dest('.tmp'));
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

gulp.task('default', ['dev:watch','webserver']);
//gulp.task('prod:dist',[]); //under development
