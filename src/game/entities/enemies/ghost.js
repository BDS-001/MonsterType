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
		const ghostOptions = {
			moveSpeed: 100,
			knockback: 0,
			wordCategory: 'veryEasy',
		};

		super(id, scene, 'ghost', ghostOptions);
	}
}
