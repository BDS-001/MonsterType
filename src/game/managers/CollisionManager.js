/**
 * Collision Detection and Response System
 *
 * Manages all collision detection between game entities and handles
 * appropriate responses such as damage, scoring, and special effects.
 */
import gameState from '../core/gameState';

/**
 * Central collision management system for all game entities
 * Handles player-enemy and projectile-enemy interactions
 */
export default class CollisionManager {
	/**
	 * Initialize collision detection system
	 * @param {Phaser.Scene} scene - The scene to set up collisions for
	 */
	constructor(scene) {
		this.scene = scene;

		this.setupCollisions();
	}

	/**
	 * Set up all collision detection pairs
	 * Registers overlap callbacks for different entity interactions
	 */
	setupCollisions() {
		this.scene.physics.add.overlap(
			this.scene.player,
			this.scene.enemyManager.getEnemies(),
			this.handlePlayerEnemyCollision.bind(this),
			null,
			this.scene
		);

		this.scene.physics.add.overlap(
			this.scene.enemyManager.getEnemies(),
			this.scene.projectileManager.getProjectiles(),
			this.handleProjectileEnemyCollision.bind(this),
			null,
			this.scene
		);

		if (this.scene.itemManager) {
			this.scene.physics.add.overlap(
				this.scene.itemManager.getItems(),
				this.scene.projectileManager.getProjectiles(),
				this.handleProjectileItemCollision.bind(this),
				null,
				this.scene
			);
		}
	}

	/**
	 * Handle collision between player and enemy
	 * @param {Player} player - The player sprite
	 * @param {Enemy} enemy - The enemy that collided with player
	 */
	handlePlayerEnemyCollision(player, enemy) {
		if (gameState.getPlayerImmunity()) {
			return;
		}

		gameState.playerHit(10);
		player.takeDamage(enemy.damage);
		enemy.knockbackEnemy();
	}

	/**
	 * Handle collision between projectile and enemy
	 * @param {Enemy} enemy - The enemy hit by the projectile
	 * @param {Projectile} projectile - The projectile that hit the enemy
	 */
	handleProjectileEnemyCollision(enemy, projectile) {
		if (!projectile.active || projectile.targetEnemyId !== enemy.id) {
			return;
		}

		const hitSuccessful = projectile.hit(enemy);

		if (hitSuccessful) {
			gameState.updateScore(10);
		}
	}

	/**
	 * Handle collision between projectile and item
	 * @param {Item} item - The item hit by the projectile
	 * @param {Projectile} projectile - The projectile that hit the item
	 */
	handleProjectileItemCollision(item, projectile) {
		if (!projectile.active || projectile.targetEnemyId !== item.id) {
			return;
		}

		const hitSuccessful = projectile.hit(item);

		if (hitSuccessful) {
			gameState.updateScore(5);
		}
	}

	/**
	 * Set player immunity status (for damage prevention)
	 * @param {boolean} immune - Whether player should be immune to damage
	 */
	setPlayerImmunity(immune) {
		this.playerImmunity = immune;
	}

	/**
	 * Check if player is currently immune to damage
	 * @returns {boolean} True if player is immune
	 */
	isPlayerImmune() {
		return this.playerImmunity;
	}

	/**
	 * Add a new collision detection pair (for future expansion)
	 * @param {Phaser.GameObjects.GameObject} objectA - First collision object/group
	 * @param {Phaser.GameObjects.GameObject} objectB - Second collision object/group
	 * @param {Function} callback - Function to call when collision occurs
	 * @param {Function} processCallback - Optional pre-processing callback
	 */
	addCollision(objectA, objectB, callback, processCallback = null) {
		this.scene.physics.add.overlap(
			objectA,
			objectB,
			callback.bind(this),
			processCallback,
			this.scene
		);
	}

	/**
	 * Clean up collision manager resources
	 * Called when scene ends or game resets
	 */
	destroy() {
		this.playerImmunity = false;
	}
}
