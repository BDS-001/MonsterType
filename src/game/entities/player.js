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

		this.scene = scene;
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setScale(gameSettings.SPRITE_SCALE);
	}

	/**
	 * Apply damage to the player and trigger visual feedback
	 * @param {number} amount - Amount of damage to apply
	 */
	takeDamage(amount) {
		this.setTint(0xff0000);

		this.scene.time.delayedCall(100, () => {
			this.clearTint();
		});

		this.scene.scene.get('HudScene').decreaseHealth(amount);
	}
}
