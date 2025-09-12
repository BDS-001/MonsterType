import ProjectileAnimation from './ProjectileAnimation.js';

export default class BasicProjectileAnimation extends ProjectileAnimation {
	animate(data) {
		if (!this.validateData(data)) return;

		const { target, impactX, impactY } = data;
		const player = this.getPlayer();

		const sprite = this.scene.add.sprite(player.x, player.y, 'basicShot');
		sprite.setScale(2);

		const toX = impactX ?? target.x;
		const toY = impactY ?? target.y;

		const angle = Phaser.Math.Angle.Between(player.x, player.y, toX, toY);
		sprite.setRotation(angle);

		this.animateProjectileMovement(sprite, player, toX, toY);
	}

	animateProjectileMovement(sprite, player, toX, toY) {
		const speed = 5;
		const distance = Phaser.Math.Distance.Between(player.x, player.y, toX, toY);
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
