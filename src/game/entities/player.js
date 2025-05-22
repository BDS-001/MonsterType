import Phaser from 'phaser';
import settings from '../config/gameConfig';

export default class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'player');

		// Reference to the scene
		this.scene = scene;

		// Add this sprite to the scene
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Set the scale of the player sprite
		this.setScale(settings.SPRITE_SCALE);
		this.health = 100;
		this.immune = false;
	}

	update() {
		return;
	}

	takeDamage() {
		this.health -= 10;
		this.setTint(0xff0000);
		this.scene.time.delayedCall(100, () => {
			this.clearTint();
		});
	}
}
