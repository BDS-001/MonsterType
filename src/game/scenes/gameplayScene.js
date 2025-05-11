import Phaser from 'phaser';
import Player from '../sprites/player';
import Enemy from '../sprites/enemy';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.currentKey = null;
        this.keyDisplay = null;
        this.player = null
        this.enemy = null
    }

    preload() {
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

        // make a custom class to add player sprite
        this.player = new Player(this, this.game.config.width / 2, this.game.config.height / 2);
        this.enemy = new Enemy(this, 200, 200)

        this.fpsText = this.add.text(10, 10, 'FPS: 0', { 
            font: '16px Arial', 
            fill: '#00ff00' 
        });

        this.keyDisplay = this.add.text(100, 100, '', {
            font: '32px Arial',
            fill: '#ffffff'
        });
    }

    update() {
        this.keyDisplay.text = this.currentKey
        this.fpsText.setText('FPS: ' + Math.round(this.game.loop.actualFps));
        this.enemy.update(this.currentKey)
        this.currentKey = null
    }
}