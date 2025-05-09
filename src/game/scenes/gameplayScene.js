import Phaser from 'phaser';
import Player from '../sprites/player';
import Enemy from '../sprites/enemy';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.currentKey = 'Welcome to game!';
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
        this.keyDisplay = this.add.text(100, 100, '', {
            font: '32px Arial',
            fill: '#ffffff'
        });

        // Use phaser key linstener instead of event listener
        this.input.keyboard.on('keydown', (event) => {
            this.currentKey = event.key;
            console.log(`Key pressed: ${this.currentKey}`);
        });

        // make a custom class to add player sprite
        this.player = new Player(this, 400, 300);
        this.enemy = new Enemy(this, 50, 50)
    }

    update() {
        this.keyDisplay.text = this.currentKey
    }
}