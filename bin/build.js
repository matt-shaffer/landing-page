const path = require('path');
const fs = require('fs').promises;
const fsExtra = require('fs-extra');
const uglify = require('uglify-js');
const CleanCSS = require('clean-css');

const OUTPUT = 'docs';
const DOMAIN = 'mattshaffer.me';

async function createCNAME() {
  await fs.writeFile(path.resolve(OUTPUT, 'CNAME'), DOMAIN, 'utf8');
}

async function createDir() {
  await fs.mkdir(OUTPUT);
}

async function processCSS() {
  const css = await fs.readFile('src/index.css', 'utf-8');
  const cleaner = new CleanCSS();
  const cleaned = cleaner.minify(css).styles;
  await fs.writeFile(path.resolve(OUTPUT, 'index.css'), cleaned, 'utf8');
}

async function processJS() {
  const js = await fs.readFile('src/index.js', 'utf-8');
  const minified = uglify.minify(js).code;
  await fs.writeFile(path.resolve(OUTPUT, 'index.js'), minified, 'utf8');
}

async function copyStatic() {
  const paths = ['index.html', 'assets'];
  paths.forEach(p => {
    fsExtra.copy(path.resolve('src', p), path.resolve(OUTPUT, p));
  });
}

async function build() {
  await Promise.all([
    createDir(),
    processJS(),
    processCSS(),
    createCNAME(),
    copyStatic()
  ]);
  console.log(`Bundled created in ${OUTPUT}`);
}

build();
