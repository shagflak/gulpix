var gulp       = require('gulp');
var sourcemaps = require('gulp-sourcemaps');

var lazypipe   = require("lazypipe");
var babel      = require('gulp-babel');
var wiredep    = require('wiredep').stream;
var server = require('gulp-server-livereload');

var config = {
    host: 'localhost',
    port: 9000
};

var app = {
    paths: {
        scripts : 'app/scripts/**/*.js',
        styles  : 'app/sass/**/*.scss',
        index   : 'app/index.html',
        tempFolder : '.tmp',
        appFolderPath : '.app'
    }
};

var transpileClient =
        gulp.src('app/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('.tmp'));

//Tasks::Prod
gulp.task('build', function() { return compileScripts(); });

gulp.task('transpile:client', function() {
    return  transpileClient();
});

gulp.task('dev:copy-index', function(){
    gulp.src(app.paths.index)
    .pipe(gulp.dest(app.paths.tempFolder));
});

gulp.task('wiredep:dev', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app/'));
});

gulp.task('webserver', function() {
gulp.src([app.paths.tempFolder, './bower_components'])
    .pipe(webserver({
        livereload: {
            enable: true,// need this set to true to enable livereload
        },
        fallback: 'index.html',//use html5Mode for my single page app with this plugin
        directoryListing: {
            enable: false,
            path: '.tmp'
        },
        path: './',
        open: true,
        host: 'localhost',
        port: 9000
    }));
});

/*
*requiring the tmp folder and the whole root of the project so we can use bower_components and other
* folders inside this server this results in a slower code maybe researching wiredep optin to hange
* the kind of path
 */
gulp.task('start:client', function(cb){
    gulp.src([app.paths.tempFolder, './'])
    .pipe(server({
          livereload: true,
          directoryListing: false,
          open: true,
          host: config.host,
          port: config.port
    }));
});

gulp.task('dev:watch', function() {
    gulp.watch(app.paths.scripts, ['transpile:client'] ); //changed from  compileScripts(true)
    gulp.watch(app.paths.index, ['dev:copy-index']);
});

gulp.task('default', ['wiredep:dev', 'dev:copy-index','dev:watch','start:client']);
//gulp.task('prod:dist',[]); //under development
//




/**
 *  Notes:
 *  1.- Add to default  task the tasks you want to execute on dev environment and on prod:dist for production build
 *  2.- If the asks needs to be watched add it to the <dev:watch> for development and prod:watch to watch the dist folde
 *  3.- Always when defining a task don't forget to add the <dev::> or <prod::> dependng on the kind of the task
 */
