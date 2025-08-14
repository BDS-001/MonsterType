import Weapon from './weapon.js';

export default class Shotgun extends Weapon {
	constructor() {
		super('Shotgun', 'Fires multiple basic projectiles in a spread pattern.', {
			cooldown: 500,
			projectileType: 'basicShot',
			spread: Math.PI / 6,
			maxTargets: 1,
			projectilesPerTarget: 3,
		});
	}
}
