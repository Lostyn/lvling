import gulp from 'gulp';
import paths from '../gulp.path';
import babel from "gulp-babel";

class Scripts {
    constructor(scope) {
        this.scope = scope;
        this.compile = this.compile.bind(this);
    }

    get scripts() {
        return this.compile;
    }

    compile() {
        return gulp.src(paths.src.scripts[this.scope])
            .pipe(babel(/*{
                presets: [
                    "@babel/preset-typescript",
                    "@babel/preset-react"
                  ],
                  plugins: [
                    "@babel/plugin-proposal-class-properties"
                  ]
            }*/))
            .pipe( gulp.dest(paths.dest.scripts[this.scope]));
    }
}

export default {
    main: new Scripts("main"),
    renderer: new Scripts("renderer")
};
  