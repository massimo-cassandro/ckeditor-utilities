import terser  from '@rollup/plugin-terser';
// import fs from 'fs';
import node_resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';



export default [
  {
    input: 'test/custom-build-test/test-files/test.js',
    plugins: [
      node_resolve(),
      // commonjs(),
      terser({ compress: { passes: 2 } }),
    ],
    output: [
      {
        file: 'test/custom-build-test/test-files/test.min.js',
        format: 'iife',
        sourcemap: true,
      }
    ]
  }
];
