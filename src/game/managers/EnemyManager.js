import Zombie from '../entities/enemies/zombie';
import Ghost from '../entities/enemies/ghost';
import Mummy from '../entities/enemies/mummy';

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

	spawnEnemiesWaves() {
		// increase difficulty every 20 seconds
		const timeMultiplier = Math.floor(this.currentTime / 20000) + 1;
		//zombies spawn 4 out of 5 waves
		const zombieCount = this.wave % 5 > 0 ? Math.max(2, 1 + timeMultiplier) : 0;

		//every 5 waves add 1
		const ghostWaveMultiplier = Math.floor(this.wave / 5);
		const ghostCount = this.wave % 5 === 0 ? 6 + ghostWaveMultiplier : 0;

		//mummies spawn every 7 waves starting from wave 7 (slow but hard words)
		const mummyCount = this.wave >= 7 && this.wave % 7 === 0 ? 1 + Math.floor(this.wave / 14) : 0;

		this.spawnEnemyType(Zombie, zombieCount);
		this.spawnEnemyType(Ghost, ghostCount);
		this.spawnEnemyType(Mummy, mummyCount);

		this.wave += 1;
	}

	spawnEnemiesGradual() {
		const gameplaySeconds = this.currentTime / 1000;

		let zombieCount = 1;
		if (gameplaySeconds > 60) zombieCount = 2; // 2 zombies after 1 minute
		if (gameplaySeconds > 120) zombieCount = 3; // 3 zombies after 2 minutes

		let ghostCount = 0;
		if (gameplaySeconds > 30 && Math.random() < 0.2) {
			ghostCount = 1; // 20% chance of 1 ghost after 30 seconds
		}

		this.spawnEnemyType(Zombie, zombieCount);
		this.spawnEnemyType(Ghost, ghostCount);
	}

	startSpawning(initialWaveDelay = 5000) {
		// Don't start if already spawning
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
