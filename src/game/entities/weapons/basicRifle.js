import Weapon from './weapon.js';

export default class BasicRifle extends Weapon {
	constructor() {
		super('Basic Rifle', 'A standard rifle with moderate fire rate.', {
			cooldown: 800,
			projectileSprite: 'basicShot',
		});
	}
}
