import Zombie from '../entities/enemies/zombie';
import Ghost from '../entities/enemies/ghost';
import Mummy from '../entities/enemies/mummy';

export default class EnemyManager {
	constructor(scene) {
		this.scene = scene;
		this.enemies = null;
		this.currentEnemyId = 0;

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

	spawnEnemiesFromCounts({ zombieCount, ghostCount, mummyCount }) {
		this.spawnEnemyType(Zombie, zombieCount);
		this.spawnEnemyType(Ghost, ghostCount);
		this.spawnEnemyType(Mummy, mummyCount);
	}

	spawnEnemiesGradual(currentTime) {
		const gameplaySeconds = currentTime / 1000;

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

	update(currentKey) {
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
		if (this.enemies) {
			this.enemies.clear(true, true);
		}
	}
}
