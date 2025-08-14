import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class CollisionManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.subscribe(GAME_EVENTS.PROJECTILES_READY, this.setupCollisions);
	}

	setupCollisions() {
		const { physics, player, enemyManager, projectileManager, itemManager } = this.scene;

		physics.add.overlap(
			player,
			enemyManager.getEnemies(),
			this.handlePlayerEnemyCollision,
			null,
			this
		);
		physics.add.overlap(
			enemyManager.getEnemies(),
			projectileManager.getProjectiles(),
			this.handleProjectileEnemyCollision,
			null,
			this
		);

		if (itemManager?.getItems()) {
			physics.add.overlap(
				itemManager.getItems(),
				projectileManager.getProjectiles(),
				this.handleProjectileItemCollision,
				null,
				this
			);
		}
	}

	handlePlayerEnemyCollision(player, enemy) {
		this.emit(GAME_EVENTS.PLAYER_HIT, { player, enemy, damage: enemy.damage || 10 });
		player.takeDamage(enemy.damage || 10);
		enemy.knockbackEnemy();
	}

	handleProjectileEnemyCollision(enemy, projectile) {
		if (!projectile.active || enemy.isDestroyed) return;
		if (projectile.targetEnemyId && projectile.targetEnemyId !== enemy.id) return;

		if (projectile.damageType === 'projectile') enemy.takeDamage(projectile.damage);
		enemy.hitEffect();
		projectile.kill();
	}

	handleProjectileItemCollision(item, projectile) {
		if (!projectile.active) return;

		projectile.kill();
		this.emit(GAME_EVENTS.ITEM_COLLECTED, { item, projectile, points: 5 });
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
