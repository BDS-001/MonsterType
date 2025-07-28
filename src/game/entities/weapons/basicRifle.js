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
	 * Create a basic rifle with balanced stats
	 */
	constructor() {
		super('Basic Rifle', 'A standard rifle with moderate fire rate and basic projectiles.', {
			attackSpeed: 800,
			projectileCount: 1,
			projectileType: 'basicShot',
			spread: 0,
		});
	}
}
