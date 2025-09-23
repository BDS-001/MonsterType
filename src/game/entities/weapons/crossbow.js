import Weapon from './weapon.js';

export default class Crossbow extends Weapon {
	constructor() {
		super('Crossbow', 'Fires bolts that ricochet between multiple enemies', {
			maxTargets: 1,
			attackAnimation: 'basic',
			maxUsages: 40,
		});
		this.ricochetCount = 3;
		this.range = 300;
	}

	damageTargetsInRadius() {
		const bodies = this.scene.physics.overlapCirc(this.x, this.y, this.range, true, false);
		if (bodies.length < 1) return;
		//TODO: get next closest enemy in range
	}
}
