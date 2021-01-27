import gulp from "gulp";
import del from "del";
import * as builder from "electron-builder";
import paths from "../gulp.path";
import bump from 'gulp-update-version';

const { Platform } = builder;

function clean() {
  return del(paths.release.output);
}

function updateVersion() {
    return gulp.src('./package.json')
      .pipe(bump({type:'patch'}))
      .pipe(gulp.dest('./'))
}

function release() {
    let platform = Platform.current();
    return builder.build({
      targets: platform.createTarget(),
      config: {
        appId: "fr.lostyn.software",
        productName: "Lostyn software",
        copyright: "Copyright © 2021 ${author}",
        directories: {
          buildResources: "resources",
          output: "release"
        },
        files: ["dist/**/*"],
        win: {
          target: "portable"
        },
        mac: {},
        linux: {
          category: "Utility"
        },
        remoteBuild: true
      }
    });
  }
  
export default gulp.series(clean, updateVersion, release);