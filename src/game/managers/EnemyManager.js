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
		this.setupEventListeners();
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.KEY_PRESSED, this.handleKeyPressed);
		this.subscribe(GAME_EVENTS.PROJECTILE_HIT, this.handleEnemyHit);
	}

	setupEnemies() {
		this.enemies = this.scene.add.group();
	}

	handleKeyPressed(key) {
		const currentEnemies = this.enemies.getChildren();
		for (let i = currentEnemies.length - 1; i >= 0; i--) {
			currentEnemies[i].update(key);
		}
	}

	updateMovement() {
		const currentEnemies = this.enemies.getChildren();
		for (let i = currentEnemies.length - 1; i >= 0; i--) {
			currentEnemies[i].update(); // Update without key for movement/positioning
		}
	}

	handleEnemyHit(data) {
		const { enemy } = data;
		if (enemy.isDestroyed || enemy.displayedWord?.length === 0) {
			this.emit(GAME_EVENTS.ENEMY_KILLED, { enemy, points: 10 });
		}
	}

	spawnEnemyType(EnemyClass, count = 1) {
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
		if (this.enemies) {
			this.enemies.clear(true, true);
		}
	}
}
