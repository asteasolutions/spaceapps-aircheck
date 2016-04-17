import path from 'path';
import replace from 'replace';
import copy from './lib/copy';

export default async () => {
  await Promise.all([
    copy('package.json', 'dist/package.json'),
  ]);

  replace({
    regex: '"start".*',
    replacement: '"start": "node server.js",',
    paths: [path.join(__dirname, '../dist/package.json')],
    recursive: false,
    silent: false,
  });
};
