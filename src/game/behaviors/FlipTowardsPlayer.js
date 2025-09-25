import Behavior from './Behavior.js';

export default class FlipTowardsPlayer extends Behavior {
	tick(_dt) {
		const player = this.scene.player;
		if (!player || !this.sprite || this.sprite.isDestroyed) return;
		this.sprite.setFlipX(player.x < this.sprite.x);
	}
}
