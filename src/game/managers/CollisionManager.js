import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class CollisionManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.subscribe(GAME_EVENTS.PROJECTILES_READY, this.setupCollisions);
	}

	setupCollisions() {
		if (!this.scene.player || !this.scene.enemyManager || !this.scene.projectileManager) {
			console.warn('CollisionManager: Required managers not ready, skipping collision setup');
			return;
		}

		const enemies = this.scene.enemyManager.getEnemies();
		const projectiles = this.scene.projectileManager.getProjectiles();

		if (!enemies || !projectiles) {
			console.warn('CollisionManager: Required groups not ready, skipping collision setup');
			return;
		}

		this.scene.physics.add.overlap(
			this.scene.player,
			enemies,
			this.handlePlayerEnemyCollision.bind(this),
			null,
			this.scene
		);

		this.scene.physics.add.overlap(
			enemies,
			projectiles,
			this.handleProjectileEnemyCollision.bind(this),
			null,
			this.scene
		);

		if (this.scene.itemManager) {
			const items = this.scene.itemManager.getItems();
			if (items) {
				this.scene.physics.add.overlap(
					items,
					projectiles,
					this.handleProjectileItemCollision.bind(this),
					null,
					this.scene
				);
			}
		}
	}

	handlePlayerEnemyCollision(player, enemy) {
		this.emit(GAME_EVENTS.PLAYER_HIT, { player, enemy, damage: enemy.damage || 10 });
		player.takeDamage(enemy.damage || 10);
		enemy.knockbackEnemy();
	}

	handleProjectileEnemyCollision(enemy, projectile) {
		if (!projectile.active) {
			return;
		}

		const hitSuccessful = projectile.hit(enemy);
		if (hitSuccessful) {
			this.emit(GAME_EVENTS.PROJECTILE_HIT, {
				projectile,
				enemy,
				damage: projectile.damage,
				points: 10,
			});
		}
	}

	handleProjectileItemCollision(item, projectile) {
		if (!projectile.active) {
			return;
		}

		const hitSuccessful = projectile.hit(item);
		if (hitSuccessful) {
			this.emit(GAME_EVENTS.ITEM_COLLECTED, { item, projectile, points: 5 });
		}
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
