import Weapon from './weapon.js';

export default class LazerGun extends Weapon {
	constructor() {
		super(
			'Lazer Gun',
			'Fires a powerful laser beam that pierces through multiple enemies in a line',
			{
				damage: 1,
				maxTargets: 1,
				attackAnimation: 'lazer',
			}
		);
		this.lazerLength = 1500;
		this.lazerWidth = 60;
	}

	shotEffect(primaryTarget) {
		const player = this.scene?.player;
		if (!player) return;

		this.damageEnemies(primaryTarget, player);

		this.scene.events.emit('weapon:fired', {
			target: primaryTarget,
			weapon: this,
			lazerLength: this.lazerLength,
			lazerWidth: this.lazerWidth,
		});
	}

	damageEnemies(primaryTarget, player) {
		const enemyGroup = this.scene?.enemyManager?.getEnemies?.();
		const enemies = enemyGroup ? enemyGroup.getChildren() : [];
		const itemGroup = this.scene?.itemManager?.getItems?.();
		const items = itemGroup ? itemGroup.getChildren() : [];
		const allTargets = [...enemies, ...items];

		if (allTargets.length === 0) return;

		const angle = Phaser.Math.Angle.Between(player.x, player.y, primaryTarget.x, primaryTarget.y);
		const laserDirX = Math.cos(angle);
		const laserDirY = Math.sin(angle);
		const lazerLengthSq = this.lazerLength * this.lazerLength;

		for (const target of allTargets) {
			const toTargetX = target.x - player.x;
			const toTargetY = target.y - player.y;

			const distanceSq = toTargetX * toTargetX + toTargetY * toTargetY;
			if (distanceSq > lazerLengthSq) continue;

			const dotProduct = toTargetX * laserDirX + toTargetY * laserDirY;
			if (dotProduct <= 0) continue;

			const distanceToLaser = Math.abs(toTargetX * laserDirY - toTargetY * laserDirX);
			if (distanceToLaser <= this.lazerWidth) {
				target.takeDamage(this.damage);
			}
		}
	}
}
