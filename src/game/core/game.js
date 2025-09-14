import Phaser from 'phaser';
import GameScene from '../scenes/gameplayScene';
import { PauseScene } from '../scenes/pauseScene';
import { HudScene } from '../scenes/hudScene';
import { GameOver } from '../scenes/gameOverScene';

export default class Game {
	constructor(gameConfig) {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		const config = {
			...gameConfig,
			width: viewportWidth,
			height: viewportHeight,
			scene: [GameScene, HudScene, PauseScene, GameOver],
		};

		this.game = new Phaser.Game(config);
		this.startGame();
	}

	startGame() {
		this.game.scene.start('GameScene');
	}

	goToMenu() {}
}
