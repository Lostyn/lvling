import gulp from "gulp";
import del from "del";
import paths from "./paths";
import { template } from "./template";
import { serve } from "./serve";
import scripts from "./scripts";
import { pack } from "./pack";
import { styles } from "./styles";
import { staticAssets } from "./static";

function clean() {
  return del(paths.dest.root);
}

function set(nodeEnv) {
  return function env() {
    process.env.NODE_ENV = nodeEnv;
    return Promise.resolve();
  };
}

function copyExtraResources() {
  return gulp
    .src([paths.src.extraResources])
    .pipe(gulp.dest(paths.dest.extraResources));
}

const prepare = gulp.series(
  clean,
  gulp.parallel(
    copyExtraResources,
    template,
    styles,
    staticAssets,
    scripts.main.scripts,
    scripts.renderer.scripts
  )
);

export const dev = gulp.series(set("dev"), prepare, serve);
export const build = gulp.series(set("prod"), prepare, pack);
