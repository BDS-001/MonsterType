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
		this.enemies = null; // Phaser group containing all active enemies
		this.currentEnemyId = 0; // Unique ID counter for enemy tracking
		this.spawnEvent = null; // Phaser timer event for spawning
		this.currentTime = 0; // Current game time for difficulty scaling
		this.wave = 1; // Current wave number

		this.setupEnemies();
	}

	/**
	 * Initialize the enemy group container
	 * Sets up a Phaser group to manage all active enemies
	 */
	setupEnemies() {
		// Create enemy group for collision detection and batch operations
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
		// Difficulty scaling: increase enemy count every 20 seconds
		const timeMultiplier = Math.floor(this.currentTime / 20000) + 1;

		// Zombies spawn in 4 out of every 5 waves (basic enemies)
		const zombieCount = this.wave % 5 > 0 ? Math.max(2, 1 + timeMultiplier) : 0;

		// Ghosts spawn every 5th wave with increasing numbers
		const ghostWaveMultiplier = Math.floor(this.wave / 5);
		const ghostCount = this.wave % 5 === 0 ? 6 + ghostWaveMultiplier : 0;

		// Mummies spawn every 7th wave starting from wave 7 (rare but challenging)
		const mummyCount = this.wave >= 7 && this.wave % 7 === 0 ? 1 + Math.floor(this.wave / 14) : 0;

		// Execute spawning for each enemy type
		this.spawnEnemyType(Zombie, zombieCount);
		this.spawnEnemyType(Ghost, ghostCount);
		this.spawnEnemyType(Mummy, mummyCount);

		// Advance to next wave
		this.wave += 1;
	}

	/**
	 * Alternative spawning method with time-based progression
	 * Provides smoother difficulty curve than wave-based spawning
	 */
	spawnEnemiesGradual() {
		const gameplaySeconds = this.currentTime / 1000;

		// Progressive zombie spawning based on elapsed time
		let zombieCount = 1;
		if (gameplaySeconds > 60) zombieCount = 2; // Double spawn after 1 minute
		if (gameplaySeconds > 120) zombieCount = 3; // Triple spawn after 2 minutes

		// Probabilistic ghost spawning for unpredictability
		let ghostCount = 0;
		if (gameplaySeconds > 30 && Math.random() < 0.2) {
			ghostCount = 1; // 20% chance after 30 seconds
		}

		// Execute spawning
		this.spawnEnemyType(Zombie, zombieCount);
		this.spawnEnemyType(Ghost, ghostCount);
	}

	/**
	 * Begin automatic enemy spawning with specified delay
	 * @param {number} initialWaveDelay - Milliseconds between spawn waves (default: 5000)
	 */
	startSpawning(initialWaveDelay = 5000) {
		// Prevent duplicate spawn timers
		if (this.spawnEvent) {
			return;
		}

		// Create repeating timer for wave-based spawning
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

		// Update each enemy (backwards iteration handles mid-loop removals safely)
		for (let i = currentEnemies.length - 1; i >= 0; i--) {
			const enemy = currentEnemies[i];
			// Pass current input to enemy for word processing
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
			// Remove all enemies from scene and destroy their objects
			this.enemies.clear(true, true);
		}
	}
}
