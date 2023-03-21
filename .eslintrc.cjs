'use strict';

const fs = require('fs');
const path = require('path');

// Directories that contain TypeScript files of note
const tsDirs = [
    'public/src',
    'src',
    'test',
];

// Helper walk function to check all directories
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = `${dir}/${file}`;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

// Find all JS files that were compiled from TS
function find_compiled_js() {
    let jsFilesList = [];

    tsDirs.forEach((tsDir) => {
        const filesList = walk(tsDir);
        const tsFilesList = filesList.filter(file => path.extname(file).toLowerCase() === '.ts');
        jsFilesList = jsFilesList.concat(filesList.filter(
            file => path.extname(file).toLowerCase() === '.js' &&
                tsFilesList.find(tsFile => tsFile === (`${file.replace(/\.[^/.]+$/, '')}.ts`)) !== undefined
        ));
    });

    if (jsFilesList.length === 0) return '';
    return jsFilesList;
}

module.exports = {
    extends: ['nodebb'],
    root: true,
    ignorePatterns: find_compiled_js(),
    rules: {
        indent: ['error', 4],
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            extends: [
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
            ],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            parserOptions: {
                ecmaFeatures: { jsx: true },
                project: './tsconfig.json',
            },
            rules: {
                'no-unused-vars': 'off',
                'no-use-before-define': 'off',
                camelcase: 'off',
                'no-prototype-builtins': 'off',
                '@typescript-eslint/camelcase': 'off',
                'no-void': 'off',
                'no-deprecated-api': 'off',
                '@typescript-eslint/no-use-before-define': 'error',
                'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
            },
        },
    ],
};
