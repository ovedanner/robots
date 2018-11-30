'use strict';

const VALID_DEPLOY_TARGETS = [ // update these to match what you call your deployment targets
  'dev',
  'prod',
];

module.exports = function(deployTarget) {
  const ENV = {
    build: {},
    redis: {
      allowOverwrite: true,
      keyPrefix: 'robots:index',
      host: 'localhost',
    },
    s3: {},
  };

  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error(`Invalid deployTarget ${deployTarget}`);
  }

  if (deployTarget === 'dev') {
    ENV.build.environment = 'development';
    ENV.redis.url = process.env.REDIS_URL || 'redis://0.0.0.0:6379/';
    // only care about deploying index.html into redis in dev
    ENV.pipeline = {
      disabled: {
        allExcept: ['build', 'redis'],
      },
    };
  }

  if (deployTarget === 'prod') {
    ENV['ssh-tunnel'] = {
      username: 'ubuntu',
      host: '63.33.51.163',
      dstHost: 'redis-robots-001.14z5xl.0001.euw1.cache.amazonaws.com',
    };
    ENV.build.environment = 'production';
    ENV.s3.accessKeyId = process.env.AWS_KEY;
    ENV.s3.secretAccessKey = process.env.AWS_SECRET;
    ENV.s3.bucket = 'themaclipper-robots-static';
    ENV.s3.region = 'eu-west-1';
  }

  return ENV;

  /* Note: a synchronous return is shown above, but ember-cli-deploy
   * does support returning a promise, in case you need to get any of
   * your configuration asynchronously. e.g.
   *
   *    var Promise = require('ember-cli/lib/ext/promise');
   *    return new Promise(function(resolve, reject){
   *      var exec = require('child_process').exec;
   *      var command = 'heroku config:get REDISTOGO_URL --app my-app-' + deployTarget;
   *      exec(command, function (error, stdout, stderr) {
   *        ENV.redis.url = stdout.replace(/\n/, '').replace(/\/\/redistogo:/, '//:');
   *        if (error) {
   *          reject(error);
   *        } else {
   *          resolve(ENV);
   *        }
   *      });
   *    });
   *
   */
};
