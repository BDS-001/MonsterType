import Weapon from './weapon.js';

export default class HeavyGun extends Weapon {
	constructor() {
		super('Heavy Gun', 'A powerful weapon that fires heavy rounds with high damage but slower fire rate.', {
			attackSpeed: 1200,
			projectileCount: 1,
			projectileType: 'heavyRounds',
			spread: 0
		});
	}
}