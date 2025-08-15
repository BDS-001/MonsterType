import Weapon from './weapon.js';

export default class HeavyGun extends Weapon {
	constructor() {
		super(
			'Heavy Gun',
			'A powerful weapon that fires heavy rounds with high damage but slower fire rate.',
			{
				cooldown: 1200,
				damage: 2,
			}
		);
	}
}
