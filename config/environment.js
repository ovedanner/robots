'use strict';

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'robots',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    contentSecurityPolicy: {
      'connect-src': "'self' https://robots.themaclipper.nl http://localhost:3000",
    },
    torii: {
      sessionServiceName: 'session',
      providers: {
        'google-oauth2': {
          apiKey: process.env.GOOGLE_API_KEY,
          redirectUri: 'http://localhost:4200/torii/redirect.html',
        },
      },
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.backendHost = 'http://localhost:3000';
    ENV.websocketHost = 'ws://localhost:3000/cable';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.backendHost = 'https://robots.themaclipper.nl';
    ENV.websocketHost = 'ws://robots.themaclipper.nl/cable';
    ENV.torii.providers['google-oauth2'].redirectUri = 'https://robots.themaclipper.nl/torii/redirect.html';
  }

  return ENV;
};
