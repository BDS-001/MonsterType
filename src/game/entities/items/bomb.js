import Item from './item.js';

export default class Bomb extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'BOMB', itemId, 'bomb');
		this.damage = this.baseValue;
		this.radius = this.config.radius;
		this.validTargets = ['item', 'enemy'];
	}

	onKill() {
		this.createBlastEffect();
		this.damageTargetsInRadius();
	}

	createBlastEffect() {
		const blastCircle = this.scene.add.graphics();
		blastCircle.setPosition(this.x, this.y);
		blastCircle.lineStyle(3, 0xff0000, 0.8);
		blastCircle.fillStyle(0xff0000, 0.3);
		blastCircle.fillCircle(0, 0, this.radius);
		blastCircle.strokeCircle(0, 0, this.radius);

		this.scene.tweens.add({
			targets: blastCircle,
			alpha: 0,
			duration: 300,
			ease: 'Power2',
			onComplete: () => blastCircle.destroy(),
		});
	}

	damageTargetsInRadius() {
		const bodies = this.scene.physics.overlapCirc(this.x, this.y, this.radius, true, false);
		const validTargets = bodies.filter((body) =>
			this.validTargets.includes(body?.gameObject?.entityType)
		);
		validTargets.forEach((body) => {
			const target = body.gameObject;
			target.takeDamage(this.damage);
		});
	}
}
