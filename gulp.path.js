const script = "**/*.{js,ts,tsx}";

export default {
    src: {
        template: 'src/renderer/index.html',
        styles: "src/**/*.{sass,scss}",
        scripts: {
            ipc: `src/ipc/${script}`,
            main: `src/main/${script}`,
            renderer: `src/renderer/${script}`,
        },
        static: `src/renderer/static/**/*`,
    },
    dest: {
        renderer: 'dist/renderer',
        style: 'index.css',
        scripts: {
            ipc: 'dist/ipc',
            main: 'dist/main',
            renderer: 'dist/renderer',
        },
        static: `dist/renderer/static`,
    },
    release: {
        output: 'release'
    }
}