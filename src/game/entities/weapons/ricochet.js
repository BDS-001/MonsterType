import Weapon from './weapon.js';

export default class Ricochet extends Weapon {
	constructor() {
		super('Ricochet Gun', 'Projectile that bounces between multiple enemies', {
			maxTargets: 1,
			attackAnimation: 'basic',
			maxUsages: 40,
		});
		this.ricochetCount = 3;
		this.range = 300;
	}

	damageTargetsInRadius() {
		const bodies = this.scene.physics.overlapCirc(this.x, this.y, this.range, true, false);
		//TODO: get next closest enemy in range
	}
}
