import Phaser from 'phaser';
import Player from '../sprites/player';
import Enemy from '../sprites/enemy';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.currentKey = null;
        this.player = null
        this.enemies
        this.spawnTimer
    }

    preload() {
        //preload game assets
        console.log('Preload phase');
        this.load.image('player', 'assets/sprite1.png')
        this.load.image('enemy', 'assets/sprite2.png')
    }

    create() {
        console.log('Create phase');

        // Use phaser key linstener instead of event listener
        this.input.keyboard.on('keydown', (event) => {
            this.currentKey = event.key;
            console.log(`Key pressed: ${this.currentKey}`);
        });

        //player sprite
        this.player = new Player(this, this.game.config.width / 2, this.game.config.height / 2);

        // setup enmies array using phaser group
        this.enemies = this.add.group();
        this.spawnEnemies()

        //fps counter text
        this.fpsText = this.add.text(10, 10, 'FPS: 0', { 
            font: '16px Arial', 
            fill: '#00ff00' 
        });
    }

    spawnEnemies() {
        this.spawnTimer = setTimeout(() => {
            clearTimeout(this.spawnTimer)
            this.enemies.add(new Enemy(this, 100, 800))
            this.spawnEnemies()
        }, 1000)
    }

    update() {
        this.fpsText.setText('FPS: ' + Math.round(this.game.loop.actualFps));
        
        const currentEnemies = this.enemies.getChildren()
        for (let i = currentEnemies.length - 1; i >= 0; i--) {
            currentEnemies[i].update(this.currentKey)
        }

        this.currentKey = null
    }
}