import Phaser from 'phaser';
import Player from '../entities/player';
import Enemy from '../entities/enemy';
import fpsCounter from '../util/fpsCounter';
import settings from '../config/gameConfig';
import Projectile from '../entities/projectile';

/**
 * Main gameplay scene
 */
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        
        // Initialize properties
        this.currentKey = null;
        this.player = null;
        this.enemies = null;
        this.spawnEvent = null;
        this.fpsDisplay = null;
        this.grassBackground = null;
        this.playerImmunity = false
        this.projectiles = null;
    }

    preload() {
        // Load game images
        this.load.image('player', 'assets/playerRight.png');
        this.load.image('zombieRight', 'assets/zombieRight.png');
        this.load.image('zombieLeft', 'assets/zombieLeft.png');
        this.load.image('grass', 'assets/grass.png')
        this.load.image('projectile', 'assets/basicShot.png')
    }

    create() {

        this.grassBackground = this.add.tileSprite(
            0, 0,                                   // Position at top-left corner
            this.cameras.main.width,                // Width of game canvas
            this.cameras.main.height,               // Height of game canvas
            'grass'                             // Your grass tile's image key
        );
        this.grassBackground.setScale(settings.SPRITE_SCALE)
        
        // Set the origin to the top-left (0,0) instead of center
        this.grassBackground.setOrigin(0, 0);

        const ENEMY_SPAWN_DELAY = 1000; // ms
        
        // Setup keyboard input
        this.setupKeyboardInput();
        
        // Create player at center of screen
        this.createPlayer();
        
        // Setup enemy group and spawning
        this.setupEnemies(ENEMY_SPAWN_DELAY);

        // Setup projectiles
        this.setupProjectiles();
        
        // Add FPS counter
        this.fpsDisplay = new fpsCounter(this)

        // Enable player and enemie collision
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.enemies, this.projectiles, this.handleProjectileEnemyCollision, null, this);

    }

    handlePlayerEnemyCollision(player, enemy) {
        if (!this.playerImmunity) {
            player.takeDamage()
            enemy.knockbackEnemy()

            this.playerImmunity = true
            this.time.delayedCall(200, () => {
                this.playerImmunity = false
            });
        }
    }

    handleProjectileEnemyCollision(enemy, projectile) {
        if (!projectile.active || projectile.targetEnemy !== enemy) {
            return;
        }
    
        console.log("Target match - applying damage!");
        enemy.takeDamage();
        projectile.kill()
    }

    // Setup keyboard input handling
    setupKeyboardInput() {
        this.input.keyboard.on('keydown', (event) => {
            this.currentKey = event.key;
        });
    }

    createPlayer() {
        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;
        this.player = new Player(this, centerX, centerY);
    }

    setupEnemies(spawnDelay) {
        // Create enemy group
        this.enemies = this.add.group();
        
        // Start spawning enemies
        this.startSpawn(spawnDelay);
    }

    setupProjectiles() {
    this.projectiles = this.physics.add.group({
        classType: Projectile,
        defaultKey: 'projectile',
        maxSize: 30,
        active: false,
        visible: false
    });
}

    spawnEnemy() {
        const MIN_SPAWN_DISTANCE = 400;
        const MAX_SPAWN_DISTANCE = 800;
        this.enemies.add(new Enemy(this, MIN_SPAWN_DISTANCE, MAX_SPAWN_DISTANCE));
    }

    startSpawn(delay) {
        this.spawnEvent = this.time.addEvent({
            delay: delay,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }

    stopSpawn() {
        if (this.spawnEvent) {
            this.spawnEvent.remove();
            this.spawnEvent = null;
        }
    }

    updateProjectiles() {
        const projectiles = this.projectiles.getChildren();
        for (let i = 0; i < projectiles.length; i++) {
            const projectile = projectiles[i];
            if (projectile.active) {
                projectile.update();
            }
        }
    }

    fireProjectile(source, targetEnemy) {
        const projectile = this.projectiles.get();
        
        if (projectile) {
            console.log("Before firing - Target enemy:", targetEnemy);
            projectile.fire(source, targetEnemy);
            console.log("After firing - projectile.targetEnemy:", projectile.targetEnemy);
        }
    }

    update() {
        // Update FPS counter
        this.fpsDisplay.updateFPS()
        
        // Update all enemies
        this.updateEnemies();

        this.updateProjectiles();
        
        // Reset current key after updating enemies
        this.currentKey = null;
    }
    
    updateEnemies() {
        const currentEnemies = this.enemies.getChildren();
        
        // Update each enemy (looping backward to handle removals)
        for (let i = currentEnemies.length - 1; i >= 0; i--) {
            currentEnemies[i].update(this.currentKey);
        }
    }
}