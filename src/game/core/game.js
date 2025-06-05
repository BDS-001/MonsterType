import Phaser from 'phaser';
import GameScene from '../scenes/gameplayScene';
import { PauseScene } from '../scenes/pauseScene';
import { HudScene } from '../scenes/hudScene';
import { GameOver } from '../scenes/gameOverScene';

export default class Game {
	constructor(gameConfig) {
		// Adjust config to match viewport dimensions
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Apply configurations
		const config = {
			...gameConfig,
			width: viewportWidth,
			height: viewportHeight,
			scene: [GameScene, HudScene, PauseScene, GameOver],
		};

		// Initialize Phaser game instance
		this.game = new Phaser.Game(config);

		this.startGame();
		return;
	}

	startGame() {
		this.game.scene.start('GameScene');
	}

	goToMenu() {
		// add later
		// this.game.scene.start('MenuScene');
	}
}
