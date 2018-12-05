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
    ENV.redis.url = 'redis://0.0.0.0:6379/';
    // only care about deploying index.html into redis in dev
    ENV.pipeline = {
      disabled: {
        allExcept: ['build', 'redis'],
      },
    };
  }

  if (deployTarget === 'prod') {
    ENV['ssh-tunnel'] = {
      username: process.env.BASTION_USER,
      host: process.env.BASTION_IP,
      dstHost: process.env.REDIS_URL,
    };
    ENV.build.environment = 'production';
    ENV.s3.accessKeyId = process.env.AWS_KEY;
    ENV.s3.secretAccessKey = process.env.AWS_SECRET;
    ENV.s3.bucket = process.env.AWS_S3_BUCKET;
    ENV.s3.region = process.env.AWS_S3_REGION;
  }

  return ENV;
};
