import Weapon from './weapon.js';

export default class Minigun extends Weapon {
	constructor() {
		super('Minigun', 'Fast firing gun that targets multiple enemies.', {
			cooldown: 0,
			projectileType: 'instantShot',
			maxTargets: 3,
			projectilesPerTarget: 1,
		});
	}
}
