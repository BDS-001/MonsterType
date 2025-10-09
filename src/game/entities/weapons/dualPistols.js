import Weapon from './weapon.js';

export default class DualPistols extends Weapon {
	constructor() {
		super('Dual Pistols', 'Fast firing gun that targets multiple enemies.', {
			maxTargets: 2,
			attackAnimation: 'basic',
			maxUsages: 150,
		});
	}
}
