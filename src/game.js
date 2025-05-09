import Phaser from 'phaser';
import GameScene from './scenes/gameplayScene';

export default class Game {
    constructor(gameConfig) {
        gameConfig.scene = [GameScene]
        this.game = new Phaser.Game(gameConfig);
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