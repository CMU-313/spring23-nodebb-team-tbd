const fs = require('fs');
const path = require('path');
const esprima = require('esprima')

const dir = path.resolve(__dirname, './');

function recursivelyFindAllJSFiles(directory) {
    const files = fs.readdirSync(directory);
    let jsFiles = [];

    files.forEach(function (file) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            jsFiles = jsFiles.concat(recursivelyFindAllJSFiles(fullPath));
        } else if (path.extname(fullPath) === '.js' && !fullPath.includes('node_modules') && !fullPath.includes('build') && fullPath.includes('src')) {
            jsFiles.push(fullPath);
        }
    });

    return jsFiles;
}

const allFiles = recursivelyFindAllJSFiles(dir);
let results = {};
allFiles.forEach(function (filename) {
    try {
        const fileContents = fs.readFileSync(filename).toString();
        results[filename] = esprima.parseModule(fileContents);
    } catch (e) {
        results[filename] = e;
    }
});

fs.writeFileSync('results.json', JSON.stringify(results, null, 4));