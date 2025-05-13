import Phaser from 'phaser';
import Player from '../sprites/player';
import Enemy from '../sprites/enemy';
import fpsCounter from '../util/fpsCounter';

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
    }

    preload() {
        // Load game images
        this.load.image('player', 'assets/playerRight.png');
        this.load.image('zombieRight', 'assets/zombieRight.png');
        this.load.image('zombieLeft', 'assets/zombieLeft.png');
    }

    create() {
        const ENEMY_SPAWN_DELAY = 1000; // ms
        
        // Setup keyboard input
        this.setupKeyboardInput();
        
        // Create player at center of screen
        this.createPlayer();
        
        // Setup enemy group and spawning
        this.setupEnemies(ENEMY_SPAWN_DELAY);
        
        // Add FPS counter
        this.fpsDisplay = new fpsCounter(this)

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