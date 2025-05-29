import gameState from "../core/gameState";

export default class CollisionManager {
    constructor(scene) {
        this.scene = scene;
        this.playerImmunity = false;
        
        this.setupCollisions();
    }

    setupCollisions() {
        // Player vs Enemy collision
        this.scene.physics.add.overlap(
            this.scene.player,
            this.scene.enemyManager.getEnemies(),
            this.handlePlayerEnemyCollision.bind(this),
            null,
            this.scene
        );

        // Projectile vs Enemy collision
        this.scene.physics.add.overlap(
            this.scene.enemyManager.getEnemies(),
            this.scene.projectileManager.getProjectiles(),
            this.handleProjectileEnemyCollision.bind(this),
            null,
            this.scene
        );
    }

    handlePlayerEnemyCollision(player, enemy) {
        // Skip collision if player is immune
        if (this.playerImmunity) {
            return;
        }

        // Apply damage and knockback
        gameState.playerHit(10)
        player.takeDamage();
        enemy.knockbackEnemy();

        // Set temporary immunity
        this.playerImmunity = true;
        this.scene.time.delayedCall(200, () => {
            this.playerImmunity = false;
        });
    }

    handleProjectileEnemyCollision(enemy, projectile) {
        // Check if projectile is active and targeting this enemy
        if (!projectile.active || projectile.targetEnemyId !== enemy.id) {
            return;
        }

        // Apply damage and remove projectile
        enemy.takeDamage();
        projectile.kill();
    }

    // Utility methods for managing immunity
    setPlayerImmunity(immune) {
        this.playerImmunity = immune;
    }

    isPlayerImmune() {
        return this.playerImmunity;
    }

    // Method to add new collision types in the future
    addCollision(objectA, objectB, callback, processCallback = null) {
        this.scene.physics.add.overlap(
            objectA,
            objectB,
            callback.bind(this),
            processCallback,
            this.scene
        );
    }

    // Cleanup method
    destroy() {
        this.playerImmunity = false;
    }
}