const fs = require('fs-extra');
const { promisify } = require('util');

const OUTPUT = 'docs';

async function clean() {
  await fs.remove(OUTPUT);
}

clean();
