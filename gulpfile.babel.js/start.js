import gulp from 'gulp';
import ts from 'gulp-typescript';
import childProcess from 'child_process';
import electron from 'electron';
import del from 'del';

function clean() {
    return del('dist');
  }

function set(nodeEnv) {
    return function env() {
      process.env.NODE_ENV = nodeEnv;
      return Promise.resolve();
    };
}

var tsProject = ts.createProject('tsconfig.json');
function mainScript() {
    var tsResult = gulp.src('src/main/**/*.ts')
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist/main'));
}

function serve() {
    childProcess.spawn(electron, ['.'], {
        stdio: 'inherit'
    })
    .on('close', function () {
        // User closed the app. Kill the host process.
        process.exit();
    });
}

export const start = gulp.series(clean, set("dev"), mainScript, serve);