import gulp from "gulp";
import del from "del";
import * as builder from "electron-builder";
import paths from "./paths";
import bump from 'gulp-update-version';

const { Platform } = builder;

function clean() {
  return del(paths.release.root);
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
      appId: "fr.hyperfiction.kioskbackoffice",
      productName: "Kiosk360 Backoffice",
      copyright: "Copyright © 2020 ${author}",
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

export const pack = gulp.series(clean, updateVersion, release);
