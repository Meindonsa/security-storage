import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/securityStorage.ts',
    output: [
        {
            file: 'dist/securityStorage.umd.js',
            format: 'umd',
            name: 'SecurityStorage', // Nom global pour usage direct dans un <script>
            globals: {
                'crypto-js': 'CryptoJS',
                'lz-string': 'LZString',
            },
            sourcemap: true,
        },
        {
            file: 'dist/securityStorage.esm.js',
            format: 'es',
            sourcemap: true,
        },
        {
            file: 'dist/securityStorage.cjs.js', // Ajout d'un format CommonJS explicite
            format: 'cjs',
            sourcemap: true,
        },
    ],
    plugins: [
        resolve({
            browser: true, // Optimisé pour les environnements navigateur
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
        }),
    ],
    external: ['crypto-js', 'lz-string'], // Dépendances externes
};