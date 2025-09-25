import Phaser from 'phaser';
import { gameSettings } from '../core/constants';
import playerConfig from '../data/player.json';

export default class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'player');

		this.scene = scene;
		scene.add.existing(this);
		scene.physics.add.existing(this);
		const scale = (playerConfig && playerConfig.scale) || gameSettings.SPRITE_SCALE;
		this.setScale(scale);
	}

	playHitEffect(immunityLength) {
		const flashDuration = 100;
		this.scene.tweens.add({
			targets: this,
			alpha: 0.3,
			duration: flashDuration,
			yoyo: true,
			repeat: Math.max(Math.floor(immunityLength / (flashDuration * 2)) - 1, 0),
			onComplete: () => this.setAlpha(1),
		});
	}
}
