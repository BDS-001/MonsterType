import Weapon from './weapon.js';

export default class BasicRifle extends Weapon {
	constructor() {
		super('Basic Rifle', 'A standard rifle with moderate fire rate and instant projectiles.', {
			cooldown: 800,
			projectileType: 'instantShot',
		});
	}
}
