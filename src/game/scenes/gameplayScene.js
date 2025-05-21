import Phaser from 'phaser';
import Player from '../sprites/player';
import Enemy from '../sprites/enemy';
import fpsCounter from '../util/fpsCounter';
import settings from '../config/gameConfig';

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
    }

    preload() {
        // Load game images
        this.load.image('player', 'assets/playerRight.png');
        this.load.image('zombieRight', 'assets/zombieRight.png');
        this.load.image('zombieLeft', 'assets/zombieLeft.png');
        this.load.image('grass', 'assets/grass.png')
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
        
        // Add FPS counter
        this.fpsDisplay = new fpsCounter(this)

        // Enable player and enemie collision
        this.physics.add.overlap(this.player, this.enemies, this.handleEnemyCollision, null, this);

    }

    handleEnemyCollision(player, enemy) {
        player.takeDamage()
        enemy.knockbackEnemy()
        
        console.log("Player health: " + player.health);
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

    update() {
        // Update FPS counter
        this.fpsDisplay.updateFPS()
        
        // Update all enemies
        this.updateEnemies();
        
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