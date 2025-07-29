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
		this.enemies = this.scene.add.group();
	}

	spawnEnemyType(EnemyClass, count = 1) {
		for (let i = 0; i < count; i++) {
			const enemyId = `enemy${this.currentEnemyId}`;
			const enemy = new EnemyClass(this.scene, enemyId);
			this.currentEnemyId++;
			this.enemies.add(enemy);
		}
	}

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

	stopSpawning() {
		if (this.spawnEvent) {
			this.spawnEvent.remove();
			this.spawnEvent = null;
		}
	}

	update(time, currentKey) {
		this.currentTime = time;
		const currentEnemies = this.enemies.getChildren();

		for (let i = currentEnemies.length - 1; i >= 0; i--) {
			const enemy = currentEnemies[i];
			enemy.update(currentKey);
		}
	}

	getEnemies() {
		return this.enemies;
	}

	getEnemyCount() {
		return this.enemies.getChildren().length;
	}

	destroy() {
		this.stopSpawning();
		if (this.enemies) {
			this.enemies.clear(true, true);
		}
	}
}
