import gulp from 'gulp';
import del from 'del';

import template from './template';
import scripts from "./scripts";
import server from "./server";
import styles from './styles';
import pack from './pack';
import staticAssets from './static';

function clean() {
    return del('dist');
  }

function set(nodeEnv) {
    return function env() {
      process.env.NODE_ENV = nodeEnv;
      return Promise.resolve();
    };
}

const prepare = gulp.series(
    clean,
    gulp.parallel(
        template,
        styles,
        staticAssets,
        gulp.series(
            scripts.ipc.scripts,
            scripts.main.scripts,
            scripts.renderer.scripts
        )
    )
)

export const dev = gulp.series(set("development"), prepare, server);
export const build = gulp.series(set("prod"), prepare, pack);