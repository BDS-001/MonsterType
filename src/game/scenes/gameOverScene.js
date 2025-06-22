/**
 * Game Over Scene
 *
 * End-game overlay scene that displays when the player dies.
 * Provides game over message and restart functionality.
 */
import gameState from '../core/gameState';

/**
 * Game over screen with restart capability
 * Handles player death state and game reset functionality
 */
export class GameOver extends Phaser.Scene {
	/**
	 * Initialize game over scene
	 * Sets up the scene as an active overlay that starts hidden
	 */
	constructor() {
		super({ key: 'GameOver', active: true });
	}

	/**
	 * Load assets needed for game over screen
	 * Preloads UI elements and button graphics
	 */
	preload() {
		// Load restart button graphic
		this.load.image('playagain', 'assets/playagain.png');
	}

	/**
	 * Create game over screen interface
	 * Sets up game over message and restart button
	 */
	create() {
		// Start hidden until player dies
		this.scene.setVisible(false);

		// Semi-transparent overlay to darken gameplay background
		this.cameras.main.setBackgroundColor('rgba(0,0,0,0.3)');

		// Main game over title text
		this.add
			.text(this.game.config.width / 2, this.game.config.height / 2 - 110, 'GAME OVER', {
				fontSize: '48px',
				color: '#ff4444',
				fontStyle: 'bold',
				stroke: '#000000',
				strokeThickness: 4,
			})
			.setOrigin(0.5);

		// Interactive restart button
		const playAgainButton = this.add.image(
			this.game.config.width / 2,
			this.game.config.height / 2,
			'playagain'
		);
		playAgainButton.setScale(5);
		playAgainButton.setInteractive();

		// Set up click handler for restart functionality
		playAgainButton.on('pointerdown', this.playAgain, this);

		// Add hover effects for better user feedback
		playAgainButton.on('pointerover', () => {
			playAgainButton.setTint(0xcccccc);
		});
		playAgainButton.on('pointerout', () => {
			playAgainButton.clearTint();
		});
	}

	/**
	 * Handle restart button click
	 * Resets game state and returns to gameplay
	 */
	playAgain() {
		// Reset all game variables to initial state
		gameState.resetGameState();

		// Hide game over screen
		this.scene.setVisible(false);

		// Restart the main gameplay scene
		this.scene.start('GameScene');
	}
}
