/**
 * Enemy Management System
 *
 * Handles enemy spawning, wave progression, and difficulty scaling.
 * Manages different enemy types with time-based and wave-based spawn patterns.
 */
import Zombie from '../entities/enemies/zombie';
import Ghost from '../entities/enemies/ghost';
import Mummy from '../entities/enemies/mummy';

/**
 * Central manager for all enemy-related operations
 * Controls spawning patterns, wave progression, and enemy lifecycle
 */
export default class EnemyManager {
	/**
	 * Initialize enemy management system
	 * @param {Phaser.Scene} scene - The scene to spawn enemies in
	 */
	constructor(scene) {
		this.scene = scene;
		this.enemies = null;
		this.currentEnemyId = 0;
		this.spawnEvent = null;
		this.currentTime = 0;
		this.wave = 1;

		this.setupEnemies();
	}

	/**
	 * Initialize the enemy group container
	 * Sets up a Phaser group to manage all active enemies
	 */
	setupEnemies() {
		this.enemies = this.scene.add.group();
	}

	/**
	 * Spawn a specific number of enemies of a given type
	 * @param {Function} EnemyClass - Constructor for the enemy type to spawn
	 * @param {number} count - How many enemies to spawn (default: 1)
	 */
	spawnEnemyType(EnemyClass, count = 1) {
		for (let i = 0; i < count; i++) {
			const enemyId = `enemy${this.currentEnemyId}`;
			const enemy = new EnemyClass(this.scene, enemyId);
			this.currentEnemyId++;
			this.enemies.add(enemy);
		}
	}

	/**
	 * Spawn enemies based on current wave number and time progression
	 * Uses complex wave patterns to create varied gameplay experiences
	 */
	spawnEnemiesWaves() {
		const timeMultiplier = Math.floor(this.currentTime / 20000) + 1;
		const zombieCount = this.wave % 5 > 0 ? Math.max(2, 1 + timeMultiplier) : 0;
		const ghostWaveMultiplier = Math.floor(this.wave / 5);
		const ghostCount = this.wave % 5 === 0 ? 6 + ghostWaveMultiplier : 0;
		const mummyCount = this.wave >= 7 && this.wave % 7 === 0 ? 1 + Math.floor(this.wave / 14) : 0;

		this.spawnEnemyType(Zombie, zombieCount);
		this.spawnEnemyType(Ghost, ghostCount);
		this.spawnEnemyType(Mummy, mummyCount);

		this.wave += 1;
	}

	/**
	 * Alternative spawning method with time-based progression
	 * Provides smoother difficulty curve than wave-based spawning
	 */
	spawnEnemiesGradual() {
		const gameplaySeconds = this.currentTime / 1000;

		let zombieCount = 1;
		if (gameplaySeconds > 60) zombieCount = 2;
		if (gameplaySeconds > 120) zombieCount = 3;

		let ghostCount = 0;
		if (gameplaySeconds > 30 && Math.random() < 0.2) {
			ghostCount = 1;
		}

		this.spawnEnemyType(Zombie, zombieCount);
		this.spawnEnemyType(Ghost, ghostCount);
	}

	/**
	 * Begin automatic enemy spawning with specified delay
	 * @param {number} initialWaveDelay - Milliseconds between spawn waves (default: 5000)
	 */
	startSpawning(initialWaveDelay = 5000) {
		if (this.spawnEvent) {
			return;
		}

		this.spawnEvent = this.scene.time.addEvent({
			delay: initialWaveDelay,
			callback: this.spawnEnemiesWaves,
			callbackScope: this,
			loop: true,
		});
	}

	/**
	 * Stop automatic enemy spawning
	 * Useful for pausing gameplay or ending the game
	 */
	stopSpawning() {
		if (this.spawnEvent) {
			this.spawnEvent.remove();
			this.spawnEvent = null;
		}
	}

	/**
	 * Update all enemies and handle input processing
	 * @param {number} time - Current game time in milliseconds
	 * @param {string|null} currentKey - The key currently being pressed
	 */
	update(time, currentKey) {
		this.currentTime = time;
		const currentEnemies = this.enemies.getChildren();

		for (let i = currentEnemies.length - 1; i >= 0; i--) {
			const enemy = currentEnemies[i];
			enemy.update(currentKey);
		}
	}

	/**
	 * Get the enemy group for collision detection or other operations
	 * @returns {Phaser.GameObjects.Group} The group containing all active enemies
	 */
	getEnemies() {
		return this.enemies;
	}

	/**
	 * Get the current number of active enemies
	 * @returns {number} Count of enemies currently in the scene
	 */
	getEnemyCount() {
		return this.enemies.getChildren().length;
	}

	/**
	 * Clean up all enemies and stop spawning
	 * Should be called when the scene ends or game resets
	 */
	destroy() {
		this.stopSpawning();
		if (this.enemies) {
			this.enemies.clear(true, true);
		}
	}
}
