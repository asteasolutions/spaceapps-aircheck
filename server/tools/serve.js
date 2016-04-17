import path from 'path';
import cp from 'child_process';
import watch from './lib/watch';

export default () => new Promise((resolve, reject) => {
  function start() {
    const server = cp.spawn(
      'node',
      ['--debug=5858', path.join(__dirname, '../dist/server.js')],
      {
        env: Object.assign({ NODE_ENV: 'development' }, process.env),
        silent: false,
      }
    );

    server.stdout.on('data', data => {
      let time = new Date().toTimeString();
      time = time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
      process.stdout.write(`[${time}] `);
      process.stdout.write(data);
      if (data.toString('utf8').includes('The server is running at')) {
        resolve();
      }
    });

    server.stderr.on('data', data => process.stderr.write(data));
    server.on('error', err => reject(err));
    server.on('exit', () => server.kill('SIGTERM'));

    return server;
  }
  let server = start();

  if (global.WATCH) {
    watch('dist/server.js').then(watcher => {
      watcher.on('changed', () => {
        server.kill('SIGTERM');
        server = start();
      });
    });
  }
});
