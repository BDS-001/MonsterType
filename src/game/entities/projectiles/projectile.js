import Phaser from 'phaser';
import { gameSettings } from '../../core/constants';

export default class Projectile extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, spriteKey = 'projectile', damage = 1) {
		super(scene, x, y, spriteKey);

		this.scene = scene;

		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setScale(gameSettings.SPRITE_SCALE / 2);
		this.setActive(false);
		this.setVisible(false);

		this.speed = 2000;
		this.damage = damage;
		this.targetEnemyId = null;
		this.deactiveBuffer = 50;
	}

	hit(enemy) {
		enemy.takeDamage(this.damage);
		this.kill();
		return true;
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
		this.setPosition(source.x, source.y);

		const directionX = target.x - source.x;
		const directionY = target.y - source.y;
		const length = Math.sqrt(directionX * directionX + directionY * directionY);
		const normalizedX = directionX / length;
		const normalizedY = directionY / length;

		this.setVelocity(normalizedX * this.speed, normalizedY * this.speed);
		this.rotation = Math.atan2(directionY, directionX);
	}

	update() {
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
