/**
 * Main Game Class
 *
 * Initializes and manages the Phaser.js game instance.
 * Handles viewport adaptation and scene management.
 */
import Phaser from 'phaser';
import GameScene from '../scenes/gameplayScene';
import { PauseScene } from '../scenes/pauseScene';
import { HudScene } from '../scenes/hudScene';
import { GameOver } from '../scenes/gameOverScene';

/**
 * Core game controller that manages the Phaser game instance
 * and handles initial setup and scene transitions
 */
export default class Game {
	/**
	 * Initialize the game with responsive viewport sizing
	 * @param {Object} gameConfig - Base Phaser configuration object
	 */
	constructor(gameConfig) {
		// Adjust config to match current browser viewport dimensions
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Create final configuration by merging base config with viewport settings
		const config = {
			...gameConfig,
			width: viewportWidth,
			height: viewportHeight,
			// Define scene loading order: Gameplay -> HUD overlay -> Pause -> Game Over
			scene: [GameScene, HudScene, PauseScene, GameOver],
		};

		// Initialize Phaser game instance with final configuration
		this.game = new Phaser.Game(config);

		// Begin gameplay immediately
		this.startGame();
		return;
	}

	/**
	 * Launch the main gameplay scene
	 * Starts the core game loop and player interaction
	 */
	startGame() {
		this.game.scene.start('GameScene');
	}

	/**
	 * Navigate to main menu (future implementation)
	 * TODO: Implement menu scene for game navigation
	 */
	goToMenu() {
		// Placeholder for future menu implementation
		// this.game.scene.start('MenuScene');
	}
}
