import Enemy from '../entities/enemy';

export default class EnemyManager {
	constructor(scene) {
		this.scene = scene;
		this.enemies = null;
		this.currentEnemyId = 0;
		this.spawnEvent = null;

		this.setupEnemies();
	}

	setupEnemies() {
		// Create enemy group using scene reference
		this.enemies = this.scene.add.group();
	}

	spawnEnemy() {
		// Create new enemy with scene reference and current ID
		const enemy = new Enemy(this.scene, this.currentEnemyId);
		this.enemies.add(enemy);
		this.currentEnemyId++;
	}

	startSpawning(delay = 1000) {
		// Don't start if already spawning
		if (this.spawnEvent) {
			return;
		}

		this.spawnEvent = this.scene.time.addEvent({
			delay: delay,
			callback: this.spawnEnemy,
			callbackScope: this,
			loop: true,
		});
	}

	stopSpawning() {
		if (this.spawnEvent) {
			this.spawnEvent.remove();
			this.spawnEvent = null;
		}
	}

	update(currentKey) {
		const currentEnemies = this.enemies.getChildren();

		// Update each enemy (loop backwards to handle potential removals)
		for (let i = currentEnemies.length - 1; i >= 0; i--) {
			const enemy = currentEnemies[i];
			// Pass the current input key from scene
			enemy.update(currentKey);
		}
	}

	// Helper methods for other managers to use
	getEnemies() {
		return this.enemies;
	}

	getEnemyCount() {
		return this.enemies.getChildren().length;
	}

	// Cleanup method for when scene ends
	destroy() {
		this.stopSpawning();
		if (this.enemies) {
			this.enemies.clear(true, true); // Remove and destroy all enemies
		}
	}
}
