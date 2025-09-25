import { runAction } from './actions.js';

export default class Triggers {
  constructor(definition = {}, scene) {
    this.scene = scene;
    this.timers = [];
    for (const key in definition) {
      const match = key.match(/^OnTimer\(([^)]+)\)$/);
      if (match) this.timers.push({ interval: parseFloat(match[1]), elapsed: 0, actions: definition[key] });
    }
  }
  tick(deltaSeconds, sprite) {
    for (const timerEntry of this.timers) {
      timerEntry.elapsed += deltaSeconds;
      while (timerEntry.elapsed >= timerEntry.interval) {
        timerEntry.elapsed -= timerEntry.interval;
        for (const action of timerEntry.actions) runAction(action, sprite, this.scene);
      }
    }
  }
}
