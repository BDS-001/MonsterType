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
		this.scene.setVisible(false);
		this.cameras.main.setBackgroundColor('rgba(0,0,0,0.3)');

		this.input.keyboard.on('keydown-ESC', () => {
			if (gameState.gameOver) return;

			const gameSceneKey = 'GameScene';

			if (this.scene.isPaused(gameSceneKey)) {
				this.scene.resume(gameSceneKey);
				this.scene.setVisible(false);
			} else {
				this.scene.pause(gameSceneKey);
				this.scene.setVisible(true);
			}
		});
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
