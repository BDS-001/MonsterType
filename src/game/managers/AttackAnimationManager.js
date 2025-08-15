import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class AttackAnimationManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.subscribe(GAME_EVENTS.WEAPON_FIRED, this.fireProjectile);
	}

	fireProjectile(data) {
		const { target, projectileSprite } = data;
		const player = this.scene.player;

		const sprite = this.scene.add.sprite(player.x, player.y, projectileSprite);
		const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
		sprite.setRotation(angle);

		const speed = 5;
		const distance = Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y);
		const duration = distance / speed;

		this.scene.tweens.add({
			targets: sprite,
			x: target.x,
			y: target.y,
			duration,
			onComplete: () => {
				sprite.destroy();
			},
		});
	}
}
