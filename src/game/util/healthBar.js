/**
 * Health Bar UI Component
 *
 * Visual representation of player health with color-coded status.
 * Provides a graphical health bar with background, border, and dynamic coloring.
 */
import gameState from '../core/gameState';

/**
 * Visual health display component using Phaser graphics
 * Shows current health as a colored bar with visual feedback for low health
 */
export default class HealthBar {
	/**
	 * Create a new health bar display
	 * @param {Phaser.Scene} scene - Scene to add the health bar to
	 * @param {number} x - X position of the health bar
	 * @param {number} y - Y position of the health bar
	 * @param {number} width - Width of the health bar (default: 150)
	 * @param {number} height - Height of the health bar (default: 30)
	 */
	constructor(scene, x, y, width = 150, height = 30) {
		this.bar = new Phaser.GameObjects.Graphics(scene);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.value = gameState.player.health;
		this.borderThickness = 8;
		this.borderOffset = this.borderThickness / 2;
		this.p = (this.width - this.borderThickness) / gameState.player.maxHealth;

		this.draw();
		scene.add.existing(this.bar);
	}

	/**
	 * Decrease health by specified amount and update display
	 * @param {number} amount - Amount of health to remove
	 * @returns {boolean} True if health reached zero (death condition)
	 */
	decrease(amount) {
		this.value -= amount;

		if (this.value < 0) {
			this.value = 0;
		}

		this.draw();
		return this.value === 0;
	}

	/**
	 * Render the health bar graphics
	 * Draws background, border, and health fill with appropriate colors
	 */
	draw() {
		this.bar.clear();

		this.bar.fillStyle(0x000000);
		this.bar.fillRect(this.x, this.y, this.width, this.height);

		this.bar.fillStyle(0xffffff);
		this.bar.fillRect(
			this.x + this.borderOffset,
			this.y + this.borderOffset,
			this.width - this.borderThickness,
			this.height - this.borderThickness
		);

		if (this.value < 30) {
			this.bar.fillStyle(0xff0000);
		} else {
			this.bar.fillStyle(0x00ff00);
		}

		const healthBarWidth = Math.floor(this.p * this.value);

		this.bar.fillRect(
			this.x + this.borderOffset,
			this.y + this.borderOffset,
			healthBarWidth,
			this.height - this.borderThickness
		);
	}
}
