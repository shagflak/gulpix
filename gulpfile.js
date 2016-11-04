var gulp       = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var glob       = require('glob');//changed from require-globify
var webserver  = require('gulp-webserver');
var lazypipe   = require("lazypipe");
var babel      = require('gulp-babel');

//Paths to files
var app = {
    paths: {
        scripts : 'app/scripts/**/*.js',
        styles  : 'app/sass/**/*.scss',
        index   : 'app/index.html'
    }
};


gulp.task('build', function() { return ''; });

gulp.task('transpile:client', function() {
    return  gulp.src(app.paths.scripts)
            .pipe(babel({
                presets: ['es2015','react']
            }))
            .pipe(gulp.dest('.tmp'));
});

gulp.task('dev:copy-index', function(){
    ´gulp.src(app.paths.index)
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

gulp.task('dev:watch', function() {
    gulp.watch(app.paths.scripts, ['transpile:client'] ); //changed from  compileScripts(true)
    gulp.watch(app.paths.index, ['dev:copy-index']);
});

//Main tasks
gulp.task('default', ['dev:copy-index','dev:watch','webserver']);
//gulp.task('prod:dist',[]); //under development

/**
 *  Notes:
 *  1.- Add to default  task the tasks you want to execute on dev environment and on prod:dist for production build
 *  2.- If the asks needs to be watched add it to the <dev:watch> for development and prod:watch to watch the dist folde
 *  3.- Always when defining a task don't forget to add the <dev::> or <prod::> dependng on the kind of the task
 */
