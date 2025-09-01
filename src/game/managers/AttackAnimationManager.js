import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class AttackAnimationManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.subscribe(GAME_EVENTS.WEAPON_FIRED, this.fireProjectile);
	}

	fireProjectile(data) {
		const { target, projectileSprite, impactX, impactY } = data;
		const player = this.scene.player;

		const sprite = this.scene.add.sprite(player.x, player.y, projectileSprite);
		sprite.setScale(2);
		const toX = impactX ?? target?.x;
		const toY = impactY ?? target?.y;
		if (toX == null || toY == null) {
			sprite.destroy();
			return;
		}
		const angle = Phaser.Math.Angle.Between(player.x, player.y, toX, toY);
		sprite.setRotation(angle);

		const speed = 5;
		const distance = Phaser.Math.Distance.Between(player.x, player.y, toX, toY);
		const duration = distance / speed;

		this.scene.tweens.add({
			targets: sprite,
			x: toX,
			y: toY,
			duration,
			onComplete: () => {
				sprite.destroy();
			},
		});
	}
}
