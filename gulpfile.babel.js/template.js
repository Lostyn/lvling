import gulp from 'gulp';
import inject from 'gulp-inject-string';
import paths from '../gulp.path';

export default function template() {
    let stream = gulp.src(paths.src.template)
        .pipe(inject.before('</head>', `<link href=\"${paths.dest.style}\" rel="stylesheet">`));
        
        
    stream.pipe(inject.before('</body>', `<script src="index.js"></script>`))
    return stream.pipe(gulp.dest(paths.dest.renderer));
}