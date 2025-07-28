/**
 * Global Game State Manager
 *
 * Centralized state management for player stats, scoring, and game flow.
 * Provides a single source of truth for game-wide data and state transitions.
 */

/**
 * Singleton class managing all global game state
 * Handles player health, scoring, immunity frames, and game flow control
 */
class GameState {
	/**
	 * Initialize game state manager
	 * Sets up initial state by calling reset function
	 */
	constructor() {
		this.resetGameState();
	}

	/**
	 * Reset all game state to initial values
	 * Called at game start and when restarting after game over
	 */
	resetGameState() {
		this.gameScene = null;
		this.player = {
			maxHealth: 100,
			health: 100,
			immunity: false,
		};
		this.score = 0;
		this.gameOver = false;
	}

	/**
	 * Toggle game over state
	 * Used to switch between playing and game over states
	 */
	toggleGameOver() {
		this.gameOver = !this.gameOver;
	}

	increaseHealth(amount) {
		this.player.maxHealth += amount;
		this.player.health += amount;
	}

	/**
	 * Handle player taking increasing Health
	 * @param {number} healAmount - Amount of health to apply
	 */
	playerHeal(healAmount) {
		if (!this.gameScene) return;

		this.player.health += healAmount;
	}

	/**
	 * Handle player taking damage with immunity frames
	 * @param {number} damage - Amount of damage to apply
	 */
	playerHit(damage) {
		if (!this.gameScene) return;

		this.player.health -= damage;
		this.player.immunity = true;

		this.gameScene.time.delayedCall(1000, () => {
			this.player.immunity = false;
		});
	}

	/**
	 * Add points to the player's score
	 * @param {number} val - Points to add to current score
	 */
	updateScore(val) {
		this.score += val;
	}

	/**
	 * Set reference to the main gameplay scene
	 * @param {Phaser.Scene} scene - The main gameplay scene instance
	 */
	setGameScene(scene) {
		this.gameScene = scene;
	}

	/**
	 * Get the current player score
	 * @returns {number} Current score value
	 */
	getScore() {
		return this.score;
	}

	/**
	 * Check if player is currently immune to damage
	 * @returns {boolean} True if player has temporary immunity
	 */
	getPlayerImmunity() {
		return this.player.immunity;
	}
}

export default new GameState();
