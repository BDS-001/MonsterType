import Phaser from 'phaser';
import GameScene from './scenes/gameplayScene';

export default class Game {
    constructor(gameConfig) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        gameConfig.width = viewportWidth
        gameConfig.height = viewportHeight
        gameConfig.scene = [GameScene]
        this.game = new Phaser.Game(gameConfig); // Setup the phaser game

        this.startGame()
        return
    }

    startGame() {
        this.game.scene.start('GameScene');
    }

    goToMenu() {
        // add later
        // this.game.scene.start('MenuScene');
    }
}