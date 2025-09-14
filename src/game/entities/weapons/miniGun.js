import Weapon from './weapon.js';

export default class Minigun extends Weapon {
	constructor() {
		super('Minigun', 'Fast firing gun that targets multiple enemies.', {
			damage: 1,
			maxTargets: 3,
			attackAnimation: 'basic',
		});
	}
}
