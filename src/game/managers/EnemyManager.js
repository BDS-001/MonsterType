import Zombie from '../entities/enemies/zombie';
import Ghost from '../entities/enemies/ghost';
import Mummy from '../entities/enemies/mummy';
import Slime from '../entities/enemies/slime.js';
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

	setupEnemies() {
		this.enemies = this.scene.add.group({
			runChildUpdate: false,
		});
	}

	setupEventListeners() {
		this.scene.events.on(GAME_EVENTS.SPAWN_ENEMIES, this.spawnEnemiesFromCounts, this);
	}

	update(delta) {
		const children = this.enemies.children.entries;
		for (let i = 0; i < children.length; i++) {
			const enemy = children[i];
			if (enemy && !enemy.isDestroyed) {
				enemy.update(delta);
			}
		}
	}

	spawnEnemyType(EnemyClass, count = 1, config = {}) {
		for (let i = 0; i < count; i++) {
			const enemyId = `enemy${this.currentEnemyId}`;

			let x, y;
			if (config.x !== undefined && config.y !== undefined) {
				x = config.x;
				y = config.y;
			} else {
				const position = this.calculateEdgePosition();
				x = position.x;
				y = position.y;
			}

			const enemy = new EnemyClass(this.scene, x, y, enemyId, config);
			this.currentEnemyId++;
			this.enemies.add(enemy);

			// Apply all active environmental effects to newly spawned enemy
			this.scene.environmentalEffectsManager?.applyEffectsToEnemy(enemy);

			this.emit(GAME_EVENTS.ENEMY_SPAWNED, { enemy });
		}
	}

	calculateEdgePosition() {
		const camera = this.scene.cameras.main;
		const width = camera.width;
		const height = camera.height;
		const margin = 100;

		const side = Math.floor(Math.random() * 4);

		let x, y;
		switch (side) {
			case 0: // Top
				x = Math.random() * width;
				y = -margin;
				break;
			case 1: // Right
				x = width + margin;
				y = Math.random() * height;
				break;
			case 2: // Bottom
				x = Math.random() * width;
				y = height + margin;
				break;
			case 3: // Left
				x = -margin;
				y = Math.random() * height;
				break;
		}

		return { x, y };
	}

	spawnEnemiesFromCounts({ zombie, ghost, mummy, slime }) {
		if (zombie?.count) this.spawnEnemyType(Zombie, zombie.count, zombie.config || {});
		if (ghost?.count) this.spawnEnemyType(Ghost, ghost.count, ghost.config || {});
		if (mummy?.count) this.spawnEnemyType(Mummy, mummy.count, mummy.config || {});
		if (slime?.count) this.spawnEnemyType(Slime, slime.count, slime.config || {});
	}

	getEnemies() {
		return this.enemies;
	}

	getEnemyCount() {
		return this.enemies.getChildren().length;
	}

	destroy() {
		this.scene.events.off(GAME_EVENTS.SPAWN_ENEMIES, this.spawnEnemiesFromCounts, this);
		this.destroyGroup(this.enemies);
		this.enemies = null;
		super.destroy();
	}
}
