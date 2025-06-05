import Phaser from 'phaser';
import { gameSettings } from '../core/constants';

export default class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'player');

		// Reference to the scene
		this.scene = scene;

		// Add this sprite to the scene
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Set the scale of the player sprite
		this.setScale(gameSettings.SPRITE_SCALE);
	}

	takeDamage(amount) {
		this.setTint(0xff0000);
		this.scene.time.delayedCall(100, () => {
			this.clearTint();
		});
		// Health handled by HUD scene
		this.scene.scene.get('HudScene').decreaseHealth(amount);
	}
}
