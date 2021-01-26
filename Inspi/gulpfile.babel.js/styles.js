import gulp from 'gulp';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import paths from './paths';

export function compile() {
    return gulp.src(paths.src.styles)
            .pipe(sass().on('error', sass.logError))
            .pipe(concat(paths.dest.style))
            .pipe(gulp.dest(paths.dest.renderer));
}

export const styles = gulp.parallel(
    compile
);