import { defineConfig } from 'tsup'

export default defineConfig({
  target: 'es2021',
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true
});
