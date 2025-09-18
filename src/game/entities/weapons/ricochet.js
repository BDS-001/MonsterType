import Weapon from './weapon.js';

export default class Ricochet extends Weapon {
	constructor() {
		super('Ricochet Gun', 'Projectile that bounces between multiple enemies', {
			damage: 1,
			maxTargets: 1,
			attackAnimation: 'basic',
		});
		this.ricochetCount = 3;
		this.range = 300;
	}

	shotEffect(primaryTarget) {
		primaryTarget.takeDamage(this.damage);
	}

	damageTargetsInRadius() {
		const bodies = this.scene.physics.overlapCirc(this.x, this.y, this.range, true, false);
		//TODO: get next closest enemy in range
	}
}
