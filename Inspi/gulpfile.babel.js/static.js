import gulp from "gulp";
import paths from "./paths";

export function compile() {
  return gulp.src(paths.src.static).pipe(gulp.dest(paths.dest.static));
}

export const staticAssets = gulp.parallel(compile);
