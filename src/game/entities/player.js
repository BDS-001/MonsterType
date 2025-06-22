/**
 * Player Character Entity
 *
 * Represents the player-controlled character in the game.
 * Handles player sprite rendering, physics, and damage effects.
 */
import Phaser from 'phaser';
import { gameSettings } from '../core/constants';

/**
 * Player sprite class with physics and damage handling
 * Extends Phaser's Arcade Physics Sprite for movement and collision detection
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
	/**
	 * Create a new player instance
	 * @param {Phaser.Scene} scene - The scene this player belongs to
	 * @param {number} x - Initial X position
	 * @param {number} y - Initial Y position
	 */
	constructor(scene, x, y) {
		super(scene, x, y, 'player');

		// Store reference to parent scene for communication
		this.scene = scene;

		// Register this sprite with the scene's display and physics systems
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Apply consistent sprite scaling across all game entities
		this.setScale(gameSettings.SPRITE_SCALE);
	}

	/**
	 * Apply damage to the player and trigger visual feedback
	 * @param {number} amount - Amount of damage to apply
	 */
	takeDamage(amount) {
		// Flash red to indicate damage taken
		this.setTint(0xff0000);

		// Remove red tint after brief flash duration
		this.scene.time.delayedCall(100, () => {
			this.clearTint();
		});

		// Delegate health management to the HUD scene
		this.scene.scene.get('HudScene').decreaseHealth(amount);
	}
}
