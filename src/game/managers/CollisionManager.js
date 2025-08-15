import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class CollisionManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.setupCollisions();
	}

	setupCollisions() {
		const { physics, player, enemyManager } = this.scene;

		physics.add.overlap(
			player,
			enemyManager.getEnemies(),
			this.handlePlayerEnemyCollision,
			null,
			this
		);
	}

	handlePlayerEnemyCollision(player, enemy) {
		if (enemy.isDying || enemy.isDestroyed) return;

		this.emit(GAME_EVENTS.PLAYER_HIT, { player, enemy, damage: enemy.damage || 10 });
		player.takeDamage(enemy.damage || 10);
		enemy.knockbackEnemy();
	}

	setPlayerImmunity(immune) {
		this.playerImmunity = immune;
	}

	isPlayerImmune() {
		return this.playerImmunity;
	}

	addCollision(objectA, objectB, callback, processCallback = null) {
		this.scene.physics.add.overlap(
			objectA,
			objectB,
			callback.bind(this),
			processCallback,
			this.scene
		);
	}

	destroy() {
		this.playerImmunity = false;
	}
}
