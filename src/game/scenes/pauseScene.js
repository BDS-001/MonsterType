/**
 * Pause Scene
 *
 * Overlay scene that handles game pausing functionality.
 * Provides pause menu interface and controls game pause/resume state.
 */
import gameState from '../core/gameState';

/**
 * Pause menu overlay scene with game state management
 * Toggles gameplay pause and displays pause interface
 */
export class PauseScene extends Phaser.Scene {
	/**
	 * Initialize pause scene
	 * Sets up the scene as an active overlay that starts hidden
	 */
	constructor() {
		super({ key: 'PauseScene', active: true });
	}
	/**
	 * Set up pause scene interface and controls
	 * Creates semi-transparent overlay and pause menu elements
	 */
	create() {
		// Start hidden until pause is triggered
		this.scene.setVisible(false);

		// Semi-transparent background overlay for pause effect
		this.cameras.main.setBackgroundColor('rgba(0,0,0,0.3)');

		// Set up ESC key handler for pause toggle functionality
		this.input.keyboard.on('keydown-ESC', () => {
			// Prevent pause actions during game over state
			if (gameState.gameOver) return;

			// Target the main gameplay scene
			const gameSceneKey = 'GameScene';

			// Toggle between paused and resumed states
			if (this.scene.isPaused(gameSceneKey)) {
				// Resume gameplay and hide pause menu
				this.scene.resume(gameSceneKey);
				this.scene.setVisible(false);
			} else {
				// Pause gameplay and show pause menu
				this.scene.pause(gameSceneKey);
				this.scene.setVisible(true);
			}
		});
		// Pause menu UI elements
		// TODO: Add more sophisticated pause menu with resume/quit options
		this.add
			.text(
				this.game.config.width / 2,
				this.game.config.height / 2,
				'PAUSED\n\nPress ESC to Resume',
				{
					fontSize: '48px',
					color: '#fff',
					align: 'center',
					fontStyle: 'bold',
					stroke: '#000000',
					strokeThickness: 3,
				}
			)
			.setOrigin(0.5);
	}
}
