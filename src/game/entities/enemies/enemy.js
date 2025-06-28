/**
 * Base Enemy Class
 *
 * Core enemy entity that extends TypedEntity with movement, positioning, and combat mechanics.
 * Provides foundation for all enemy types with shared behaviors like movement AI and damage handling.
 */
import TypedEntity from '../typedEntity';
import wordBank from '../../data/wordbank';
import { gameSettings } from '../../core/constants';

/**
 * Calculate a random spawn position outside the camera view
 * @param {Phaser.Camera} camera - The main game camera
 * @returns {Object} Position coordinates {x, y} outside screen bounds
 */
function calculateRandomPosition(camera) {
	const width = camera.width;
	const height = camera.height;

	// Calculate screen center for positioning reference
	const centerX = width / 2;
	const centerY = height / 2;

	// Generate random angle for spawn direction
	const angle = Math.random() * Math.PI * 2;

	// Calculate spawn distance outside screen bounds with buffer
	const maxRadius = Math.sqrt(width * width + height * height) / 2 + 50;

	// Convert polar coordinates to cartesian coordinates
	let x = centerX + Math.cos(angle) * maxRadius;
	let y = centerY + Math.sin(angle) * maxRadius;

	return { x, y };
}

// Default configuration values for enemy behavior
const defaultOptions = {
	moveSpeed: 50, // Base movement speed in pixels per second
	knockback: 10, // Distance pushed back when hit
	wordCategory: 'easy', // Difficulty level for word selection
	damage: 10, // Damage dealt to player on collision
};

/**
 * Base enemy class with AI movement and word-typing mechanics
 * Extends TypedEntity to provide combat and movement behaviors
 */
export default class Enemy extends TypedEntity {
	/**
	 * Create a new enemy instance
	 * @param {number} id - Unique identifier for this enemy
	 * @param {Phaser.Scene} scene - The scene this enemy belongs to
	 * @param {string} spriteImage - Texture key for enemy sprite
	 * @param {Object} options - Enemy configuration options
	 */
	constructor(id, scene, spriteImage, options = {}) {
		// Merge provided options with defaults
		const enemyOptions = { ...defaultOptions, ...options };

		// Select random word from appropriate difficulty category
		const wordBankIndex = Math.floor(Math.random() * wordBank[enemyOptions.wordCategory].length);
		const word = wordBank[enemyOptions.wordCategory][wordBankIndex];

		// Generate spawn position outside camera view
		const { x: spawnX, y: spawnY } = calculateRandomPosition(scene.cameras.main);

		// Initialize parent TypedEntity with position, word, and ID
		super(scene, spawnX, spawnY, spriteImage, word, id);

		// Face towards player (flip sprite if spawning on right side)
		if (this.x > scene.player.x) this.flipX = true;

		// Store enemy properties
		this.moveSpeed = enemyOptions.moveSpeed; // Movement speed in pixels/second
		this.knockback = enemyOptions.knockback; // Knockback distance when hit
		this.damage = enemyOptions.damage; // Damage dealt to player
		this.displayedWord = this.word; // Current word being displayed

		// Apply consistent sprite scaling
		this.setScale(gameSettings.SPRITE_SCALE);
	}

	/**
	 * Check if enemy is currently visible on screen
	 * Used to optimize input processing - only on-screen enemies respond to typing
	 * @returns {boolean} True if enemy is within camera bounds (with margin)
	 */
	isEnemyOnScreen() {
		const camera = this.scene.cameras.main;
		const margin = 50; // Buffer zone for smooth transitions

		// Check if enemy position is within expanded camera bounds
		return (
			this.x > camera.scrollX - margin &&
			this.x < camera.scrollX + camera.width + margin &&
			this.y > camera.scrollY - margin &&
			this.y < camera.scrollY + camera.height + margin
		);
	}

	/**
	 * Move enemy towards the player using normalized direction vector
	 * Provides consistent movement speed regardless of distance to player
	 */
	moveEnemy() {
		if (this.isDestroyed) return;

		// Calculate direction vector from enemy to player
		const player = this.scene.player;
		const directionX = player.x - this.x;
		const directionY = player.y - this.y;

		// Calculate distance for vector normalization
		const length = Math.sqrt(directionX * directionX + directionY * directionY);

		// Prevent division by zero and ensure movement
		if (length > 0) {
			// Normalize direction vector to unit length
			const normalizedX = directionX / length;
			const normalizedY = directionY / length;

			// Apply movement speed to normalized direction
			this.setVelocity(normalizedX * this.moveSpeed, normalizedY * this.moveSpeed);
		}
	}

	/**
	 * Push enemy away from player when hit or on collision
	 * Provides visual feedback and prevents enemy stacking
	 */
	knockbackEnemy() {
		if (this.isDestroyed || this.knockback === 0) return;

		// Calculate direction vector from player to enemy (opposite of movement)
		const player = this.scene.player;
		const directionX = player.x - this.x;
		const directionY = player.y - this.y;

		// Calculate distance for vector normalization
		const length = Math.sqrt(directionX * directionX + directionY * directionY);

		// Ensure valid direction vector exists
		if (length > 0) {
			// Normalize direction vector
			const normalizedX = directionX / length;
			const normalizedY = directionY / length;

			// Push enemy away from player by knockback distance
			this.x -= normalizedX * this.knockback;
			this.y -= normalizedY * this.knockback;
		}
	}

	/**
	 * Visual and physical feedback when enemy takes damage
	 * Provides red flash effect and knockback for impact feedback
	 */
	hitEffect() {
		// Apply red tint to indicate damage
		this.setTint(0xff0000);

		// Remove tint after brief duration (damage flash effect)
		this.scene.time.delayedCall(100, () => {
			if (!this.isDestroyed) {
				this.clearTint();
			}
		});

		// Push enemy away from impact point
		this.knockbackEnemy();
	}

	/**
	 * Main enemy update loop called each frame
	 * Handles input processing, movement, and UI element positioning
	 * @param {string|null} letter - The letter currently being typed by player
	 */
	update(letter) {
		if (this.isDestroyed) return;

		// Process player input only if enemy is visible and letter was typed
		if (this.isEnemyOnScreen() && letter) {
			this.updateWord(letter);
		}

		// Continue movement towards player
		this.moveEnemy();

		// Keep text elements positioned relative to enemy sprite
		if (this.healthText) {
			// Position word text above enemy sprite
			this.healthText.setPosition(this.x, this.y - this.displayHeight / 2 - 10);
		}
		if (this.debugText) {
			// Position debug info below enemy sprite
			this.debugText.setPosition(this.x, this.y + 40);
		}
	}
}
