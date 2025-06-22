/**
 * Input Management System
 *
 * Handles keyboard input capture and processing for the typing game mechanics.
 * Tracks current key presses and provides a simple interface for input polling.
 */
export default class InputManager {
	/**
	 * Initialize input management for a scene
	 * @param {Phaser.Scene} scene - The scene to handle input for
	 */
	constructor(scene) {
		this.scene = scene;
		this.currentKey = null; // Currently pressed key
		this.setupKeyboardInput();
	}

	/**
	 * Set up keyboard event listeners
	 * Captures keydown events and stores the pressed key for processing
	 */
	setupKeyboardInput() {
		this.scene.input.keyboard.on('keydown', (event) => {
			this.currentKey = event.key;
			// Debug output for development (consider removing in production)
			console.log(event.key);
		});
	}

	/**
	 * Get the most recently pressed key
	 * @returns {string|null} The key that was pressed, or null if no key pressed
	 */
	getCurrentKey() {
		return this.currentKey;
	}

	/**
	 * Clear the current key state
	 * Should be called each frame after processing input to reset for next frame
	 */
	update() {
		this.currentKey = null;
	}
}
