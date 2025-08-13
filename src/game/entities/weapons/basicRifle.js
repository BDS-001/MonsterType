import Weapon from './weapon.js';

export default class BasicRifle extends Weapon {
	constructor() {
		super('Basic Rifle', 'A standard rifle with moderate fire rate and basic projectiles.', {
			cooldown: 800,
			projectileCount: 1,
			projectileType: 'basicShot',
			spread: 0,
		});
	}
}
