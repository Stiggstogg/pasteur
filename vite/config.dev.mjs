import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    assetsInclude: ['**/*.xml'],         // include xml files as static assets
    server: {
        port: 8080
    }
});