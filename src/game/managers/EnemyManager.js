import Zombie from '../entities/enemies/zombie';
import Ghost from '../entities/enemies/ghost';
import Mummy from '../entities/enemies/mummy';
import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class EnemyManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.enemies = null;
		this.currentEnemyId = 0;

		this.setupEnemies();
	}

	setupEnemies() {
		this.enemies = this.scene.add.group({
			runChildUpdate: true,
		});
	}

	spawnEnemyType(EnemyClass, count = 1) {
		console.log(`EnemyManager: spawning ${count} ${EnemyClass.name}s`);
		for (let i = 0; i < count; i++) {
			const enemyId = `enemy${this.currentEnemyId}`;
			const enemy = new EnemyClass(this.scene, enemyId);
			this.currentEnemyId++;
			this.enemies.add(enemy);
			this.emit(GAME_EVENTS.ENEMY_SPAWNED, { enemy });
		}
	}

	spawnEnemiesFromCounts({ zombieCount, ghostCount, mummyCount }) {
		this.spawnEnemyType(Zombie, zombieCount);
		this.spawnEnemyType(Ghost, ghostCount);
		this.spawnEnemyType(Mummy, mummyCount);
	}

	getEnemies() {
		return this.enemies;
	}

	getEnemyCount() {
		return this.enemies.getChildren().length;
	}

	destroy() {
		console.log('EnemyManager.destroy() called');
		if (this.enemies) {
			this.enemies.clear(true, true);
			this.enemies = null;
		}
		super.destroy();
	}
}
