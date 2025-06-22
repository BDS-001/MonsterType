/**
 * Mummy Enemy Type
 *
 * Slow but challenging enemy that uses difficult words.
 * Tank-like enemy that requires skill to defeat due to complex vocabulary.
 */
import Enemy from './enemy.js';

/**
 * Heavy mummy enemy with slow movement but difficult words
 * Provides late-game challenge through complex typing requirements
 */
export default class Mummy extends Enemy {
	/**
	 * Create a new mummy enemy
	 * @param {Phaser.Scene} scene - The scene this mummy belongs to
	 * @param {number} id - Unique identifier for this mummy
	 */
	constructor(scene, id) {
		// Mummy-specific configuration
		const mummyOptions = {
			moveSpeed: 20, // Very slow movement speed
			knockback: 20, // Minimal knockback resistance
			wordCategory: 'hard', // Uses complex, difficult words
		};

		// Initialize with mummy sprite and configuration
		super(id, scene, 'mummy', mummyOptions);
	}
}
