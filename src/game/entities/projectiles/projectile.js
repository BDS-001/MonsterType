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

		this.scene = scene;

		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setScale(gameSettings.SPRITE_SCALE / 2);
		this.setActive(false);
		this.setVisible(false);

		this.speed = 2000;
		this.damage = damage;
		this.targetEnemyId = null;
		this.deactiveBuffer = 50;
	}

	/**
	 * Handle projectile impact with enemy
	 * @param {Enemy} enemy - The enemy that was hit
	 * @returns {boolean} True if hit was successful and should award points
	 */
	hit(enemy) {
		enemy.takeDamage(this.damage);
		this.kill();
		return true;
	}

	/**
	 * Deactivate and reset projectile for object pool reuse
	 * Returns projectile to inactive state for efficient memory management
	 */
	kill() {
		this.setActive(false);
		this.setVisible(false);
		this.body.enable = false;
		this.targetEnemyId = null;
	}

	/**
	 * Launch projectile from source towards target
	 * @param {Object} source - Entity firing the projectile (has x, y coordinates)
	 * @param {Object} target - Target to aim at (has x, y coordinates and id)
	 */
	fire(source, target) {
		this.targetEnemyId = target.id;
		this.body.enable = true;
		this.setActive(true);
		this.setVisible(true);
		this.setPosition(source.x, source.y);

		const directionX = target.x - source.x;
		const directionY = target.y - source.y;
		const length = Math.sqrt(directionX * directionX + directionY * directionY);
		const normalizedX = directionX / length;
		const normalizedY = directionY / length;

		this.setVelocity(normalizedX * this.speed, normalizedY * this.speed);
		this.rotation = Math.atan2(directionY, directionX);
	}

	/**
	 * Update projectile each frame
	 * Handles projectile cleanup when it travels off-screen
	 */
	update() {
		const bounds = this.scene.physics.world.bounds;

		if (
			this.x < bounds.x - this.deactiveBuffer ||
			this.x > bounds.width + this.deactiveBuffer ||
			this.y < bounds.y - this.deactiveBuffer ||
			this.y > bounds.height + this.deactiveBuffer
		) {
			this.kill();
		}
	}
}
