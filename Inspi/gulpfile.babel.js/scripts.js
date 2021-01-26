import gulp from "gulp";
import paths from "./paths";
import babel from "gulp-babel";
import { join, extname, basename, dirname } from "path";

class Scripts {
  constructor(scope) {
    this.scope = scope;
    this.compile = this.compile.bind(this);
  }

  get scripts() {
    return this.compile;
  }

  compile() {
    return gulp
      .src(paths.src.scripts[this.scope])
      .pipe(
        babel({
          presets: [
            [
              "@babel/env",
              {
                useBuiltIns: "entry"
              }
            ],
            "@babel/preset-react"
          ],
          plugins: [
            ["@babel/plugin-transform-runtime"],
            ["@babel/plugin-proposal-optional-chaining"],
            [
              "emotion",
              {
                // sourceMap is on by default but source maps are dead code eliminated in production
                sourceMap: true,
                labelFormat: "[local]",
                cssPropOptimization: true
              }
            ]
          ]
        })
      )
      .pipe(gulp.dest(paths.dest.scripts[this.scope]));
  }
}

export default {
  main: new Scripts("main"),
  renderer: new Scripts("renderer")
};
