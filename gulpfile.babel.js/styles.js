import gulp from 'gulp'
import sass from 'gulp-dart-sass';
import concat from 'gulp-concat';
import paths from '../gulp.path';

export default function compile() {
    return gulp.src(paths.src.styles)
            .pipe(sass().on('error', sass.logError))
            .pipe(concat(paths.dest.style))
            .pipe(gulp.dest(paths.dest.renderer));
}