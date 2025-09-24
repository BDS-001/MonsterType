import ProjectileAnimation from './ProjectileAnimation.js';
import { gameSettings } from '../core/constants.js';

export default class CrossbowProjectileAnimation extends ProjectileAnimation {
	animate(data) {
		if (!this.validateData(data)) return;

		const { target, impactX, impactY, originX, originY } = data;

		const sprite = this.scene.add.sprite(originX, originY, 'arrowShot');
		sprite.setScale(gameSettings.SPRITE_SCALE);

		const toX = impactX ?? target.x;
		const toY = impactY ?? target.y;

		const angle = Phaser.Math.Angle.Between(originX, originY, toX, toY);
		sprite.setRotation(angle);

		this.animateProjectileMovement(sprite, originX, originY, toX, toY);
	}

	animateProjectileMovement(sprite, originX, originY, toX, toY) {
		const speed = 8;
		const distance = Phaser.Math.Distance.Between(originX, originY, toX, toY);
		const duration = distance / speed;

		this.scene.tweens.add({
			targets: sprite,
			x: toX,
			y: toY,
			duration,
			onComplete: () => sprite.destroy(),
		});
	}
}
