import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['**/__tests__/*.spec.ts'],
      exclude: [...configDefaults.exclude, 'e2e/**', './src/__tests__/_*.ts'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      coverage: {
        reporter: ['text', 'lcov', 'html'],
        exclude: ['./dist','**/main.ts', '**/.eslintrc.cjs', '**/__tests__/*.ts', '**/directive/*.ts', '**/router/*.ts','**/dev-dist/*.ts'],
      },
    },
  }),
)
