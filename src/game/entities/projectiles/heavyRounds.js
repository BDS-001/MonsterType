/**
 * Heavy Rounds Projectile
 *
 * High-damage projectile type for powerful weapons.
 * Deals increased damage compared to basic shots.
 */
import Projectile from './projectile.js';

/**
 * Heavy-damage projectile for advanced weapons
 * Provides increased damage output for more challenging enemies
 */
export default class HeavyRounds extends Projectile {
	/**
	 * Create a new heavy rounds projectile
	 * @param {Phaser.Scene} scene - The scene this projectile belongs to
	 * @param {number} x - Initial X position
	 * @param {number} y - Initial Y position
	 */
	constructor(scene, x, y) {
		super(scene, x, y, 'projectile', 2);
	}
}
