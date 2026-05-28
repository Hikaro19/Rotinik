/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }: { mode: string }) => {
  return {
    plugins: [angular(), tsconfigPaths()],
    test: {
      globals: true,
      setupFiles: ['src/test-setup.ts'],
      environment: 'jsdom',
      include: ['src/**/*.spec.ts'],
      reporters: ['default'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
      }
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
