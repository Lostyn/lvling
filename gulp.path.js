const script = "**/*.ts?(x)";

export default {
    src: {
        template: 'src/renderer/index.html',
        styles: "src/**/*.{sass,scss}",
        scripts: {
            main: `src/main/${script}`,
            renderer: `src/renderer/${script}`,
        },
    },
    dest: {
        renderer: 'dist/renderer',
        style: 'index.css',
        scripts: {
            main: 'dist/main',
            renderer: 'dist/renderer',
        },
    },
    release: {
        output: 'release'
    }
}