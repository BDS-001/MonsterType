// File: ./src/game/entities/projectile.js
import Phaser from 'phaser';
import { gameSettings } from '../../core/constants';

export default class Projectile extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, spriteKey = 'projectile', damage = 1) {
		super(scene, x, y, spriteKey);

		// Reference to the scene
		this.scene = scene;

		// Add this sprite to the scene
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Set the scale of the projectile
		this.setScale(gameSettings.SPRITE_SCALE / 2);

		// Set active and visible to false initially
		this.setActive(false);
		this.setVisible(false);

		this.speed = 2000;
		this.damage = damage;
		this.targetEnemyId = null;
		this.deactiveBuffer = 50;
	}

	kill() {
		this.setActive(false);
		this.setVisible(false);
		this.body.enable = false;
		this.targetEnemyId = null;
	}

	fire(source, target) {
		this.targetEnemyId = target.id;
		this.body.enable = true;
		this.setActive(true);
		this.setVisible(true);

		// Position the projectile at the starting point
		this.setPosition(source.x, source.y);

		// Calculate direction towards target
		const directionX = target.x - source.x;
		const directionY = target.y - source.y;

		// Normalize the direction vector
		const length = Math.sqrt(directionX * directionX + directionY * directionY);
		const normalizedX = directionX / length;
		const normalizedY = directionY / length;

		// Set velocity based on direction and speed
		this.setVelocity(normalizedX * this.speed, normalizedY * this.speed);

		// Rotate projectile to face direction of travel
		this.rotation = Math.atan2(directionY, directionX);
	}

	update() {
		// Deactivate when projectile leaves the screen
		const bounds = this.scene.physics.world.bounds;
		if (
			this.x < bounds.x - this.deactiveBuffer ||
			this.x > bounds.width + this.deactiveBuffer ||
			this.y < bounds.y - this.deactiveBuffer ||
			this.y > bounds.height + this.deactiveBuffer
		) {
			this.kill();
		}
	}
}
