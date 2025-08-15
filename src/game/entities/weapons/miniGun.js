import Weapon from './weapon.js';

export default class Minigun extends Weapon {
	constructor() {
		super('Minigun', 'Fast firing gun that targets multiple enemies.', {
			cooldown: 0,
			damage: 1,
			maxTargets: 3,
		});
	}
}
