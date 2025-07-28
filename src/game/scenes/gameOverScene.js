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
		this.load.image('playagain', 'assets/playagain.png');
	}

	/**
	 * Create game over screen interface
	 * Sets up game over message and restart button
	 */
	create() {
		this.scene.setVisible(false);
		this.cameras.main.setBackgroundColor('rgba(0,0,0,0.3)');

		this.add
			.text(this.game.config.width / 2, this.game.config.height / 2 - 110, 'GAME OVER', {
				fontSize: '48px',
				color: '#ff4444',
				fontStyle: 'bold',
				stroke: '#000000',
				strokeThickness: 4,
			})
			.setOrigin(0.5);

		const playAgainButton = this.add.image(
			this.game.config.width / 2,
			this.game.config.height / 2,
			'playagain'
		);
		playAgainButton.setScale(5);
		playAgainButton.setInteractive();

		playAgainButton.on('pointerdown', this.playAgain, this);

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
		gameState.resetGameState();
		this.scene.setVisible(false);
		this.scene.start('GameScene');
	}
}
