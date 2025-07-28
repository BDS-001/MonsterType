/**
 * Shotgun Weapon
 *
 * Multi-projectile weapon with spread pattern for close-range combat.
 * Fires multiple projectiles simultaneously with reduced accuracy.
 */
import Weapon from './weapon.js';

/**
 * Spread-pattern weapon that fires multiple projectiles in a cone
 * Effective for close-range combat and crowd control
 */
export default class Shotgun extends Weapon {
	/**
	 * Create a shotgun with spread pattern firing
	 */
	constructor() {
		super('Shotgun', 'Fires multiple basic projectiles in a spread pattern.', {
			attackSpeed: 1000,
			projectileCount: 3,
			projectileType: 'basicShot',
			spread: Math.PI / 6,
		});
	}
}
