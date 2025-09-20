import Weapon from './weapon.js';

export default class Pistol extends Weapon {
	constructor() {
		super('Pistol', 'A standard pistol with unlimited ammo.', {
			attackAnimation: 'basic',
		});
	}
}
