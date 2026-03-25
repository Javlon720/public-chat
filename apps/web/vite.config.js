import { defineConfig } from 'vite'
import { config } from '../../packages/shared/config';

export default defineConfig({
    server: {
        port: config.port_vite || 5173,
        host: true
    },
    build: {
        minify: 2048
    }
})

