import Weapon from './weapon.js';

export default class Shotgun extends Weapon {
	constructor() {
		super('Shotgun', 'Fires multiple basic projectiles in a spread pattern.', {
			attackSpeed: 1000,
			projectileCount: 3,
			projectileType: 'basicShot',
			spread: Math.PI / 6, // 30 degree spread
		});
	}
}
