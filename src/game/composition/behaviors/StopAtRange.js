import Phaser from 'phaser';
import Behavior from '../Behavior.js';

export default class StopAtRange extends Behavior {
  constructor(sprite, config, scene) {
    super(sprite, config, scene);
    this.range = config?.range ?? 280;
    this.hysteresis = config?.hysteresis ?? 16;
    this.tag = config?.tag ?? 'inRange';
  }
  tick(_dt) {
    const player = this.scene.player;
    if (!player || !this.sprite || this.sprite.isDestroyed) return;
    const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.x, player.y);
    if (distance <= this.range) {
      this.sprite.setVelocity(0, 0);
      this.sprite.tags?.add?.(this.tag);
    } else if (distance >= this.range + this.hysteresis) {
      this.sprite.tags?.delete?.(this.tag);
    }
  }
}
