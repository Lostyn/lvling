const script = "**/*.js?(x)";

export default {
  src: {
    template: "src/renderer/index.html",
    styles: "src/**/*.{sass,scss}",
    scripts: {
      main: `src/main/${script}`,
      renderer: `src/renderer/${script}`,
    },
    static: `src/renderer/static/**/*`,
    extraResources: `src/extraResources/*`,
  },
  dest: {
    root: "dist",
    renderer: "dist/renderer",
    style: "index.css",
    scripts: {
      main: "dist/main",
      renderer: "dist/renderer",
    },
    static: `dist/renderer/static`,
    extraResources: `dist/extraResources`,
  },
  release: {
    root: "release",
  },
};
