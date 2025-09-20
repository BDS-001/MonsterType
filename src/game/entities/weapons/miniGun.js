import Weapon from './weapon.js';

export default class Minigun extends Weapon {
	constructor() {
		super('Minigun', 'Fast firing gun that targets multiple enemies.', {
			maxTargets: 3,
			attackAnimation: 'basic',
			maxUsages: 50,
		});
	}
}
