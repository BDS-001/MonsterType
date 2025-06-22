/**
 * Zombie Enemy Type
 *
 * Basic enemy type with moderate speed and easy words.
 * Represents the most common enemy in the game with balanced stats.
 */
import Enemy from './enemy.js';

/**
 * Standard zombie enemy with moderate movement speed and knockback
 * Uses easy difficulty words for beginner-friendly gameplay
 */
export default class Zombie extends Enemy {
	/**
	 * Create a new zombie enemy
	 * @param {Phaser.Scene} scene - The scene this zombie belongs to
	 * @param {number} id - Unique identifier for this zombie
	 */
	constructor(scene, id) {
		// Zombie-specific configuration
		const zombieOptions = {
			moveSpeed: 40, // Moderate movement speed
			knockback: 80, // Significant knockback when hit
			wordCategory: 'easy', // Uses simple words for typing
		};

		// Initialize with zombie sprite and configuration
		super(id, scene, 'zombie', zombieOptions);
	}
}
