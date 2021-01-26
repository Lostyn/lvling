import gulp from 'gulp';
import inject from 'gulp-inject-string';
import paths from './paths';

export function template() {
    let stream = gulp.src(paths.src.template)
        .pipe(inject.before('</head>', `<link href=\"${paths.dest.style}\" rel="stylesheet">`));
    
    if(process.env.NODE_ENV == 'dev') {
        stream.pipe(inject.before('</body>', `<script>require('electron-connect').client.create()</script>\n`));
    } 

    stream.pipe(gulp.dest(paths.dest.renderer));
    return stream;
}