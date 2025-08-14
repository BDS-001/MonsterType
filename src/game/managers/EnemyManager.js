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
		this.enemies = this.scene.add.group({
			runChildUpdate: true,
		});
	}

	handleKeyPressed(key) {
		this.emit(GAME_EVENTS.TYPING_INPUT, { key });
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

	findValidTargets(letter) {
		return this.enemies.getChildren().filter((enemy) => {
			if (enemy.isDestroyed || !enemy.isEnemyOnScreen()) return false;
			return enemy.typedIndex < enemy.word.length && letter === enemy.word[enemy.typedIndex];
		});
	}

	sortTargetsByDistance(targets, player) {
		return targets.sort((a, b) => {
			const distanceA = Phaser.Math.Distance.Between(player.x, player.y, a.x, a.y);
			const distanceB = Phaser.Math.Distance.Between(player.x, player.y, b.x, b.y);
			return distanceA - distanceB;
		});
	}

	destroy() {
		if (this.enemies) {
			this.enemies.clear(true, true);
		}
	}
}
