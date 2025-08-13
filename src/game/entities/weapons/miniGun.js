import Weapon from './weapon.js';

export default class Minigun extends Weapon {
	constructor() {
		super('Minigun', 'Fast firing gun that targets multiple enemies.', {
			cooldown: 0,
			projectileCount: 1,
			projectileType: 'basicShot',
			spread: 0,
		});
	}
}
