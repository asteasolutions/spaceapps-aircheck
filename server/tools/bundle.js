import webpack from 'webpack';
import config from './config';

export default async () => new Promise((resolve, reject) => {
  const bundler = webpack(config);
  let bundlerRunCount = 0;

  function bundle(err, stats) {
    if (err) {
      reject(err);
    } else {
      // eslint-disable-next-line no-console
      console.log(stats.toString(config[0].stats));

      if (++bundlerRunCount === (global.watch ? config.length : 1)) {
        resolve();
      }
    }
  }

  if (global.WATCH) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});
