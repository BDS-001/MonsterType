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
		// Create graphics object for drawing the health bar
		this.bar = new Phaser.GameObjects.Graphics(scene);

		// Position and dimensions
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		// Health tracking
		this.value = gameState.player.health; // Current health value

		// Visual styling properties
		this.borderThickness = 8; // Border width around health bar
		this.borderOffset = this.borderThickness / 2; // Offset for inner health display

		// Calculate pixel-to-health ratio for accurate bar scaling
		this.p = (this.width - this.borderThickness) / gameState.player.maxHealth;

		// Initial render
		this.draw();

		// Add to scene display list
		scene.add.existing(this.bar);
	}

	/**
	 * Decrease health by specified amount and update display
	 * @param {number} amount - Amount of health to remove
	 * @returns {boolean} True if health reached zero (death condition)
	 */
	decrease(amount) {
		// Apply damage to current health value
		this.value -= amount;

		// Prevent health from going below zero
		if (this.value < 0) {
			this.value = 0;
		}

		// Update visual representation
		this.draw();

		// Return true if player has died
		return this.value === 0;
	}

	/**
	 * Render the health bar graphics
	 * Draws background, border, and health fill with appropriate colors
	 */
	draw() {
		// Clear previous graphics
		this.bar.clear();

		// Draw black background/border
		this.bar.fillStyle(0x000000);
		this.bar.fillRect(this.x, this.y, this.width, this.height);

		// Draw white background for health area
		this.bar.fillStyle(0xffffff);
		this.bar.fillRect(
			this.x + this.borderOffset,
			this.y + this.borderOffset,
			this.width - this.borderThickness,
			this.height - this.borderThickness
		);

		// Choose health bar color based on remaining health
		if (this.value < 30) {
			// Red for critical health (below 30)
			this.bar.fillStyle(0xff0000);
		} else {
			// Green for healthy state
			this.bar.fillStyle(0x00ff00);
		}

		// Calculate health bar width based on current health
		const healthBarWidth = Math.floor(this.p * this.value);

		// Draw the actual health indicator
		this.bar.fillRect(
			this.x + this.borderOffset,
			this.y + this.borderOffset,
			healthBarWidth,
			this.height - this.borderThickness
		);
	}
}
