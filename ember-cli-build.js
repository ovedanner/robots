'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const env = EmberApp.env();
const isProductionLikeBuild = ['production'].indexOf(env) > -1;

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    'ember-bootstrap': {
      bootstrapVersion: 4,
      importBootstrapFont: false,
      importBootstrapCSS: false,
    },
    'ember-font-awesome': {
      useScss: true,
    },
    fingerprint: {
      enabled: isProductionLikeBuild,
      prepend: 'https://s3-eu-west-1.amazonaws.com/themaclipper-robots-static/',
    },
    sourcemaps: {
      enabled: !isProductionLikeBuild,
    },
    minifyCSS: { enabled: isProductionLikeBuild },
    minifyJS: { enabled: isProductionLikeBuild },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
