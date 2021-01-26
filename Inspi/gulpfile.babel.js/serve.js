import gulp from 'gulp';
import { DevElectron } from './DevElectron';
import paths from './paths';
import { template } from './template';
import scripts from './scripts';
import { styles } from './styles';


export function serve() {
    let electron = new DevElectron();

    // Watch main process
    gulp.watch(paths.src.scripts.main, gulp.series(scripts.main.scripts, electron.restart));
    
    // Watch renderer process
    gulp.watch(paths.src.template, gulp.series(template, electron.reload));
    gulp.watch(paths.src.styles, gulp.series(styles, electron.reload));
    gulp.watch(paths.src.scripts.renderer, gulp.series(scripts.renderer.scripts, electron.reload));

    electron.start();
    return electron.onClose();
}