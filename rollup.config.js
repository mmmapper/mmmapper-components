import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default {
  input: 'src/index.js',
  moduleContext: {
    [require.resolve('pixi-projection')]: 'window',
  },
  output: [
    { file: pkg.module, format: 'es' },
    { file: pkg.main, format: 'umd', name },
  ],
  plugins: [
    commonjs(),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
      preprocess: sveltePreprocess({
        // sourceMap: !production,
      }),
    }),
    nodePolyfills({
      include: ['node_modules/pixi.js/**'],
      url: true,
    }),
    // inject({
    //   include: ['node_modules/pixi-projection/**'],
    //   PIXI: path.resolve('src/components/lib/pixi/index.js'),
    // }),
    resolve({
      preferBuiltins: true,
    }),
  ],
};
