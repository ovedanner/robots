/**
 * Inject the AJAX service.
 * @param application
 */
export function initialize(application) {
  application.inject('route', 'ajax', 'service:ajax');
  application.inject('controller', 'ajax', 'service:ajax');
  application.inject('component', 'ajax', 'service:ajax');
  application.inject('model', 'ajax', 'service:ajax');
  application.inject('authenticator', 'ajax', 'service:ajax');
}

export default {
  initialize,
};
