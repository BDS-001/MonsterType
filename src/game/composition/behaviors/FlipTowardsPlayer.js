import Behavior from '../Behavior.js';

export default class FlipTowardsPlayer extends Behavior {
  tick() {
    const player = this.scene.player;
    if (!player || !this.sprite) return;
    this.sprite.flipX = this.sprite.x > player.x;
  }
}
