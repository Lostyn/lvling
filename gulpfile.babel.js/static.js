import gulp from "gulp";
import paths from "../gulp.path";

export default function compile() {
  return gulp.src(paths.src.static).pipe(gulp.dest(paths.dest.static));
}
