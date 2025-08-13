import Phaser from 'phaser';
import { gameSettings } from '../core/constants';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'player');

		this.scene = scene;
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setScale(gameSettings.SPRITE_SCALE);
	}

	takeDamage(amount) {
		this.scene.tweens.add({
			targets: this,
			tint: 0xff0000,
			duration: 50,
			yoyo: true,
			onComplete: () => this.clearTint(),
		});

		this.scene.events.emit(GAME_EVENTS.PLAYER_HIT, { damage: amount });
	}
}
