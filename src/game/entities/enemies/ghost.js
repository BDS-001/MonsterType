/**
 * Ghost Enemy Type
 *
 * Fast-moving enemy with no knockback resistance.
 * Uses very easy words but compensates with high speed for challenge.
 */
import Enemy from './enemy.js';

/**
 * Speedy ghost enemy that moves quickly but can't be knocked back
 * Uses very easy words to balance its high mobility
 */
export default class Ghost extends Enemy {
	/**
	 * Create a new ghost enemy
	 * @param {Phaser.Scene} scene - The scene this ghost belongs to
	 * @param {number} id - Unique identifier for this ghost
	 */
	constructor(scene, id) {
		// Ghost-specific configuration
		const ghostOptions = {
			moveSpeed: 100, // Very fast movement speed
			knockback: 0, // No knockback - ghost phases through impacts
			wordCategory: 'veryEasy', // Simplest words to compensate for speed
		};

		// Initialize with ghost sprite and configuration
		super(id, scene, 'ghost', ghostOptions);
	}
}
