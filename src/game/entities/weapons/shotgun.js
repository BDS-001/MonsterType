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
	 * Create a new shotgun weapon
	 * Configured for multi-projectile spread pattern firing
	 */
	constructor() {
		super('Shotgun', 'Fires multiple basic projectiles in a spread pattern.', {
			attackSpeed: 1000, // 1000ms between shots (1 shot per second)
			projectileCount: 3, // Three projectiles per shot
			projectileType: 'basicShot', // Uses standard damage projectiles
			spread: Math.PI / 6, // 30 degree spread cone (π/6 radians)
		});
	}
}
