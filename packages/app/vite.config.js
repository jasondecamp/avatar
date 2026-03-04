import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      __BUILD_VERSION__: Date.now(),
    },
    server: {
      port: parseInt(env.VITE_PORT) || 8060,
    },
    resolve: {
      alias: {
        '@avatar/library': path.resolve(__dirname, '../library/src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['node_modules', 'src'],
        },
      },
    },
  };
});
