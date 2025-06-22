/**
 * Base Projectile Class
 *
 * Core projectile entity that handles movement, collision, and lifecycle management.
 * Provides foundation for different projectile types with shared physics and targeting.
 */
import Phaser from 'phaser';
import { gameSettings } from '../../core/constants';

/**
 * Physics-enabled projectile with targeting and damage capabilities
 * Extends Phaser's Arcade Physics Image for collision detection and movement
 */
export default class Projectile extends Phaser.Physics.Arcade.Image {
	/**
	 * Create a new projectile instance
	 * @param {Phaser.Scene} scene - The scene this projectile belongs to
	 * @param {number} x - Initial X position
	 * @param {number} y - Initial Y position
	 * @param {string} spriteKey - Texture key for projectile sprite (default: 'projectile')
	 * @param {number} damage - Damage value dealt on impact (default: 1)
	 */
	constructor(scene, x, y, spriteKey = 'projectile', damage = 1) {
		super(scene, x, y, spriteKey);

		// Store reference to parent scene
		this.scene = scene;

		// Register with scene systems
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Scale projectile smaller than other sprites
		this.setScale(gameSettings.SPRITE_SCALE / 2);

		// Start inactive and invisible for object pooling
		this.setActive(false);
		this.setVisible(false);

		// Projectile properties
		this.speed = 2000; // Movement speed in pixels per second
		this.damage = damage; // Damage dealt to targets
		this.targetEnemyId = null; // ID of target enemy for collision validation
		this.deactiveBuffer = 50; // Extra pixels before deactivating off-screen
	}

	/**
	 * Handle projectile impact with enemy
	 * @param {Enemy} enemy - The enemy that was hit
	 * @returns {boolean} True if hit was successful and should award points
	 */
	hit(enemy) {
		// Apply damage to the target enemy
		enemy.takeDamage(this.damage);

		// Destroy this projectile after impact
		this.kill();

		// Indicate successful hit for scoring system
		return true;
	}

	/**
	 * Deactivate and reset projectile for object pool reuse
	 * Returns projectile to inactive state for efficient memory management
	 */
	kill() {
		// Deactivate for object pooling
		this.setActive(false);
		this.setVisible(false);

		// Disable physics body to prevent collisions
		this.body.enable = false;

		// Clear targeting information
		this.targetEnemyId = null;
	}

	/**
	 * Launch projectile from source towards target
	 * @param {Object} source - Entity firing the projectile (has x, y coordinates)
	 * @param {Object} target - Target to aim at (has x, y coordinates and id)
	 */
	fire(source, target) {
		// Set target for collision validation
		this.targetEnemyId = target.id;

		// Activate projectile systems
		this.body.enable = true;
		this.setActive(true);
		this.setVisible(true);

		// Position projectile at firing source
		this.setPosition(source.x, source.y);

		// Calculate direction vector from source to target
		const directionX = target.x - source.x;
		const directionY = target.y - source.y;

		// Normalize direction vector for consistent speed
		const length = Math.sqrt(directionX * directionX + directionY * directionY);
		const normalizedX = directionX / length;
		const normalizedY = directionY / length;

		// Apply velocity in target direction
		this.setVelocity(normalizedX * this.speed, normalizedY * this.speed);

		// Rotate sprite to face direction of travel
		this.rotation = Math.atan2(directionY, directionX);
	}

	/**
	 * Update projectile each frame
	 * Handles projectile cleanup when it travels off-screen
	 */
	update() {
		// Get world bounds for boundary checking
		const bounds = this.scene.physics.world.bounds;

		// Check if projectile has traveled beyond screen boundaries
		if (
			this.x < bounds.x - this.deactiveBuffer ||
			this.x > bounds.width + this.deactiveBuffer ||
			this.y < bounds.y - this.deactiveBuffer ||
			this.y > bounds.height + this.deactiveBuffer
		) {
			// Clean up projectile to prevent memory leaks
			this.kill();
		}
	}
}
