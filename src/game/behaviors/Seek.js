import Behavior from './Behavior.js';

export default class Seek extends Behavior {
	constructor(sprite, config, scene) {
		super(sprite, config, scene);
		this.speed = config?.speed ?? 180;
	}

	tick(_dt) {
		const player = this.scene.player;
		if (!player || !this.sprite || this.sprite.isDestroyed || this.sprite.isKnockedBack) return;
		const directionX = player.x - this.sprite.x;
		const directionY = player.y - this.sprite.y;
		const distance = Math.hypot(directionX, directionY) || 1;
		const velocityX = (directionX / distance) * this.speed;
		const velocityY = (directionY / distance) * this.speed;
		this.sprite.setVelocity(velocityX, velocityY);
	}
}
