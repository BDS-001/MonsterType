import Phaser from 'phaser';
import GameScene from '../scenes/gameplayScene';
import { PauseScene } from '../scenes/pauseScene';
import { HudScene } from '../scenes/hudScene';
import { GameOver } from '../scenes/gameOverScene';
import { MainMenu } from '../scenes/mainMenuScene';
import { DevOverlayScene } from '../scenes/devOverlayScene';

export default class Game {
	constructor(gameConfig) {
		const config = {
			...gameConfig,
			scene: [MainMenu, GameScene, HudScene, PauseScene, GameOver, DevOverlayScene],
		};

		this.game = new Phaser.Game(config);
	}
}
