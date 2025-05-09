import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.currentKey = 'Welcome to game!';
        this.keyDisplay = null;
    }

    preload() {
        console.log('Preload phase');
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
    }

    update() {
        this.keyDisplay.text = this.currentKey
    }
}