import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
    const isBuild = command === 'build';

    return {
        base: './',         // common configuration for both "dev" / "serve" and "build"
        server: {
            port: 8080
        },
        build: isBuild
            ? {             // configuration for "build"
                assetsInlineLimit: 0,        // avoids inlining assets as base64 URLs, which Phaser does not support
                chunkSizeWarningLimit: 1500, // Phaser is large; avoid noisy warnings for expected chunk size
                rolldownOptions: {
                    output: {
                        codeSplitting: {    // split phaser into a single junk, as this avoids long reloadings
                            groups: [
                                { name: 'phaser', test: /node_modules[\\/]phaser[\\/]/
                                }
                            ]
                        }
                    }
                }
            }
            : undefined     // configuration for "dev" / "serve"
    };
});
