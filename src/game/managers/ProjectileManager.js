/**
 * Projectile Management System
 *
 * Handles projectile object pooling, spawning, and lifecycle management.
 * Uses Phaser's object pooling for efficient projectile reuse.
 */
import BasicShot from '../entities/projectiles/basicShot';
import HeavyRounds from '../entities/projectiles/heavyRounds';

/**
 * Manager for all projectile objects in the game
 * Implements object pooling pattern for performance optimization
 */
export default class ProjectileManager {
	/**
	 * Initialize projectile management system
	 * @param {Phaser.Scene} scene - The scene to manage projectiles in
	 */
	constructor(scene) {
		this.scene = scene;
		this.projectiles = null; // Phaser group for object pooling
		this.currentWeaponClass = BasicShot; // Default projectile type

		this.setupProjectiles();
	}

	/**
	 * Set up the projectile object pool
	 * Creates a Phaser physics group with object pooling configuration
	 */
	setupProjectiles() {
		this.projectiles = this.scene.physics.add.group({
			maxSize: 100, // Maximum number of projectiles in pool
			active: false, // New projectiles start inactive
			visible: false, // New projectiles start invisible
			runChildUpdate: true, // Enable update() calls on projectiles
			classType: this.currentWeaponClass, // Default projectile class
			createCallback: (projectile) => {
				// Ensure projectile has scene reference
				projectile.scene = this.scene;
			},
		});
	}

	/**
	 * Get the projectile group for collision detection and management
	 * @returns {Phaser.Physics.Arcade.Group} The group containing all projectiles
	 */
	getProjectiles() {
		return this.projectiles;
	}

	/**
	 * Get a projectile from the object pool
	 * Reuses inactive projectiles or creates new ones if pool is empty
	 * @returns {Projectile} An available projectile object
	 */
	getProjectile() {
		// Try to get an inactive projectile from the pool
		let projectile = this.projectiles.get();

		// If pool is empty, create a new projectile
		if (!projectile) {
			projectile = new this.currentWeaponClass(this.scene, 0, 0);
			this.projectiles.add(projectile);
		}

		return projectile;
	}

	/**
	 * Update all active projectiles
	 * Called each frame to handle projectile movement and cleanup
	 */
	update() {
		const projectiles = this.projectiles.getChildren();
		// Update only active projectiles for performance
		for (let i = 0; i < projectiles.length; i++) {
			const projectile = projectiles[i];
			if (projectile.active) {
				projectile.update();
			}
		}
	}
}
