/**
 * HUD (Heads-Up Display) Scene
 *
 * Overlay scene that displays game UI elements like score, health, and FPS.
 * Runs concurrently with the main gameplay scene to provide real-time information.
 */
import gameState from '../core/gameState';
import HealthBar from '../util/healthBar';
import fpsCounter from '../util/fpsCounter';

/**
 * User interface overlay scene for displaying game statistics and status
 * Maintains persistent UI elements throughout gameplay
 */
export class HudScene extends Phaser.Scene {
	/**
	 * Initialize HUD scene
	 * Sets up the scene to run as an active overlay
	 */
	constructor() {
		super({ key: 'HudScene', active: true });

		this.scoreText = null;
		this.healthBar = null;
		this.healthText = null;
		this.fpsDisplay = null;
	}
	/**
	 * Create all HUD elements and position them on screen
	 * Sets up score display, health bar, and development indicators
	 */
	create() {
		const devText = this.add.text(this.game.config.width / 2, 20, '🚧 GAME UNDER DEVELOPMENT 🚧', {
			fontSize: '24px',
			fontFamily: 'Arial, sans-serif',
			fill: '#ffffff',
			stroke: '#000000',
			strokeThickness: 2,
			fontStyle: 'bold',
		});
		devText.setOrigin(0.5, 0);

		this.scoreText = this.add.text(
			this.game.config.width / 2,
			60,
			`Score: ${gameState.getScore()}`,
			{
				fontSize: '24px',
				fontFamily: 'Arial, sans-serif',
				fill: '#ffffff',
				stroke: '#000000',
				strokeThickness: 2,
				fontStyle: 'bold',
			}
		);
		this.scoreText.setOrigin(0.5, 0);

		this.healthText = this.add.text(20, this.game.config.height - 40, 'Health', {
			fontSize: '18px',
			fontFamily: 'Arial, sans-serif',
			fill: '#ffffff',
			stroke: '#000000',
			strokeThickness: 2,
			fontStyle: 'bold',
		});

		this.healthBar = new HealthBar(this, 85, this.game.config.height - 50);
		this.fpsDisplay = new fpsCounter(this);
	}

	/**
	 * Update HUD elements each frame
	 * Refreshes dynamic content like score and performance metrics
	 */
	update() {
		this.scoreText.setText(`Score: ${gameState.getScore()}`);
		this.fpsDisplay.updateFPS();
	}

	/**
	 * Apply damage to the health bar display
	 * @param {number} amount - Amount of health to decrease
	 * @returns {boolean} Result from health bar decrease operation
	 */
	decreaseHealth(amount) {
		return this.healthBar.decrease(amount);
	}
}
