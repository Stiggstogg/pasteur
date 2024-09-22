import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        assetsInlineLimit: 0,           // avoids that referenced assets (pictures) are inlined as base64 URLs, as Phaser does not support them!
        chunkSizeWarningLimit: 1500,    // increase chunk size warning limit from 500 KiB to 1500 as phaser is pretty big
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2
            },
            mangle: true,
            format: {
                comments: false
            }
        }
    },
    assetsInclude: ['**/*.xml'],         // include xml files as static assets
    server: {
        port: 8080
    }
});