import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

/**
 * Timer component that displays a circle countdown.
 */
export default Component.extend({
  classNames: ['game-timer'],
  countdown: null,
  actualCountdown: null,

  didInsertElement(...args) {
    this._super(args);
    this.startAnimation();
    this.timerTask.perform();
  },

  startAnimation() {
    const animation = `countdown ${this.countdown}s linear infinite forwards`;
    this.element.querySelector('.game-timer__inner circle').style.animation = animation;
  },

  stopAnimation() {
    this.element.querySelector('.game-timer__inner circle').style.animation = null;
  },

  timerTask: task(function* () {
    this.set('actualCountdown', this.countdown);

    for (let i = 0; i < this.countdown; i++) {
      yield timeout(1000);
      this.decrementProperty('actualCountdown');
    }

    this.stopAnimation();
  }).drop(),
});
