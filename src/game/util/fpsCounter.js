/**
 * FPS (Frames Per Second) Counter Utility
 *
 * Development tool for monitoring game performance.
 * Displays real-time frame rate information on screen.
 */
import Phaser from 'phaser';

/**
 * Performance monitoring text display
 * Extends Phaser's Text object to show current FPS
 */
export default class fpsCounter extends Phaser.GameObjects.Text {
	/**
	 * Create an FPS counter display
	 * @param {Phaser.Scene} scene - Scene to add the counter to
	 * @param {number} x - X position on screen (default: 10)
	 * @param {number} y - Y position on screen (default: 10)
	 * @param {string} text - Initial display text (default: 'FPS: 0')
	 */
	constructor(scene, x = 10, y = 10, text = 'FPS: 0') {
		const FPS_TEXT_STYLE = {
			font: '16px Arial',
			fill: '#00ff00',
		};

		super(scene, x, y, text, FPS_TEXT_STYLE);
		scene.add.existing(this);
		this.scene = scene;
	}

	/**
	 * Update the FPS display with current frame rate
	 * Should be called each frame to show real-time performance
	 */
	updateFPS() {
		const currentFps = Math.round(this.scene.game.loop.actualFps);
		this.setText('FPS: ' + currentFps);
	}
}
