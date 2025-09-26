import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';
import enemies from '../data/enemies.json';
import { spawnEntityFromDef } from '../entities/EntityFactory.js';

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

	spawnEnemiesFromList(spawnList = []) {
		for (const entry of spawnList) {
			const definition = enemies[entry.id];
			if (!definition) {
				throw new Error(`EnemyManager: unknown enemy id '${entry.id}'`);
			}
			const count = entry.count ?? 1;
			for (let i = 0; i < count; i++) {
				const enemyId = `enemy${this.currentEnemyId}`;
				const enemy = spawnEntityFromDef(this.scene, definition, enemyId);
				this.currentEnemyId++;
				this.enemies.add(enemy);
				this.emit(GAME_EVENTS.ENEMY_SPAWNED, { enemy });
			}
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
			this.enemies = null;
		}
		super.destroy();
	}
}
