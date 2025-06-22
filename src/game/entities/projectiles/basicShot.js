/**
 * Basic Shot Projectile
 *
 * Standard projectile type with basic damage and speed.
 * The most common projectile used by default weapons.
 */
import Projectile from './projectile.js';

/**
 * Standard projectile with balanced damage and speed characteristics
 * Used by basic weapons for general-purpose combat
 */
export default class BasicShot extends Projectile {
	/**
	 * Create a new basic shot projectile
	 * @param {Phaser.Scene} scene - The scene this projectile belongs to
	 * @param {number} x - Initial X position
	 * @param {number} y - Initial Y position
	 */
	constructor(scene, x, y) {
		// Initialize with standard projectile sprite and 1 damage
		super(scene, x, y, 'projectile', 1);
	}
}
