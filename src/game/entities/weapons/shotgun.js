import Weapon from './weapon.js';

export default class Shotgun extends Weapon {
	constructor() {
		// TODO: Implement spread-based area damage
		// Should use raycast to find enemies in cone pattern and apply damage
		super('Shotgun', 'DISABLED - Needs spread implementation', {
			cooldown: 999999, // Effectively disabled
			damage: 1,
			maxTargets: 1,
		});
	}
}
