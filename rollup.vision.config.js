import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'public/vision_bundle.js', // path to your ESM bundle
  output: {
    file: 'public/vision_bundle.classic.js', // output classic bundle
    format: 'iife', // or 'umd'
    name: 'mp', // global variable name
  },
  plugins: [resolve(), commonjs()],
};