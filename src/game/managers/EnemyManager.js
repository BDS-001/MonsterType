import Zombie from '../entities/enemies/zombie';
import Ghost from '../entities/enemies/ghost';

export default class EnemyManager {
	constructor(scene) {
		this.scene = scene;
		this.enemies = null;
		this.currentEnemyId = 0;
		this.spawnEvent = null;
		this.currentTime = 0;
		this.wave = 1;

		this.setupEnemies();
	}

	setupEnemies() {
		// Create enemy group using scene reference
		this.enemies = this.scene.add.group();
	}

	spawnEnemyType(EnemyClass, count = 1) {
		for (let i = 0; i < count; i++) {
			const enemy = new EnemyClass(this.scene, this.currentEnemyId);
			this.currentEnemyId++;
			this.enemies.add(enemy);
		}
	}

	spawnEnemies() {
		// increase difficulty every 30 seconds
		const timeMultiplier = Math.floor(this.currentTime / 30000) + 1;
		const zombieCount = this.wave % 5 > 0 ? Math.max(3, 1 + timeMultiplier) : 0;
		
		//every 5 waves add 1
		const ghostWaveMultiplier = Math.floor(this.wave / 5)
		const ghostCount = this.wave % 5 === 0 ? 4 + ghostWaveMultiplier : 0;

		this.spawnEnemyType(Zombie, zombieCount);
		this.spawnEnemyType(Ghost, ghostCount);

		this.wave += 1;
	}

	startSpawning(initialWaveDelay = 5000) {
		// Don't start if already spawning
		if (this.spawnEvent) {
			return;
		}

		this.spawnEvent = this.scene.time.addEvent({
			delay: initialWaveDelay,
			callback: this.spawnEnemies,
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

	update(time, currentKey) {
		this.currentTime = time;
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
