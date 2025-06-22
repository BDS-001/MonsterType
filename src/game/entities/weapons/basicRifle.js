/**
 * Basic Rifle Weapon
 *
 * Standard single-shot weapon with moderate fire rate and accuracy.
 * Provides balanced gameplay for general combat situations.
 */
import Weapon from './weapon.js';

/**
 * Standard rifle weapon with single projectile firing
 * Balanced fire rate and accuracy for reliable combat performance
 */
export default class BasicRifle extends Weapon {
	/**
	 * Create a new basic rifle weapon
	 * Configured with balanced stats for general-purpose combat
	 */
	constructor() {
		super('Basic Rifle', 'A standard rifle with moderate fire rate and basic projectiles.', {
			attackSpeed: 800, // 800ms between shots (1.25 shots per second)
			projectileCount: 1, // Single projectile per shot
			projectileType: 'basicShot', // Uses standard damage projectiles
			spread: 0, // No spread - perfectly accurate
		});
	}
}
