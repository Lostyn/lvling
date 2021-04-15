import gulp from 'gulp'
import paths from '../gulp.path';
import electronConnect from 'electron-connect';

import scripts from './scripts';
import template from './template';
import styles from './styles';

var electron = electronConnect.server.create({
    stopOnClose: true,
});

var onDone;
var callback = function(electronProcState) {
    console.log('electron process state: ' + electronProcState);
    if (electronProcState == 'stopped') {
        onDone();
        process.exit();
    }
  };

function reload(done) {
    electron.reload();
    done();
}

function restart(done) {
    electron.restart();
    done();
}

export default function server(done) {
    onDone = done;
    electron.start(callback);

    // Watch main process
    gulp.watch(paths.src.scripts.ipc, gulp.series(scripts.ipc.scripts, restart));
    gulp.watch(paths.src.scripts.main, gulp.series(scripts.main.scripts, restart));

    // Watch renderer process
    gulp.watch(paths.src.template, gulp.series(template, reload));
    gulp.watch(paths.src.styles, gulp.series(styles, reload));
    gulp.watch(paths.src.scripts.renderer, gulp.series(scripts.renderer.scripts, reload));

    return onDone;
}