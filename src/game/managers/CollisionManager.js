import gameState from '../core/gameState';

export default class CollisionManager {
	constructor(scene) {
		this.scene = scene;

		this.setupCollisions();
	}

	setupCollisions() {
		this.scene.physics.add.overlap(
			this.scene.player,
			this.scene.enemyManager.getEnemies(),
			this.handlePlayerEnemyCollision.bind(this),
			null,
			this.scene
		);

		this.scene.physics.add.overlap(
			this.scene.enemyManager.getEnemies(),
			this.scene.projectileManager.getProjectiles(),
			this.handleProjectileEnemyCollision.bind(this),
			null,
			this.scene
		);

		if (this.scene.itemManager) {
			this.scene.physics.add.overlap(
				this.scene.itemManager.getItems(),
				this.scene.projectileManager.getProjectiles(),
				this.handleProjectileItemCollision.bind(this),
				null,
				this.scene
			);
		}
	}

	handlePlayerEnemyCollision(player, enemy) {
		if (gameState.getPlayerImmunity()) {
			return;
		}

		gameState.playerHit(10);
		player.takeDamage(enemy.damage);
		enemy.knockbackEnemy();
	}

	handleProjectileEnemyCollision(enemy, projectile) {
		if (!projectile.active || projectile.targetEnemyId !== enemy.id) {
			return;
		}

		const hitSuccessful = projectile.hit(enemy);

		if (hitSuccessful) {
			gameState.updateScore(10);
		}
	}

	handleProjectileItemCollision(item, projectile) {
		if (!projectile.active || projectile.targetEnemyId !== item.id) {
			return;
		}

		const hitSuccessful = projectile.hit(item);

		if (hitSuccessful) {
			gameState.updateScore(5);
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
