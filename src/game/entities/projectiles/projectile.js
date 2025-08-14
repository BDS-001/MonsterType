import Phaser from 'phaser';
import { gameSettings } from '../../core/constants';

export default class Projectile extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, spriteKey = 'projectile', damage = 1) {
		super(scene, x, y, spriteKey);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setScale(gameSettings.SPRITE_SCALE / 2);
		this.setActive(false);
		this.setVisible(false);

		this.speed = 3500;
		this.damage = damage;
		this.targetEnemyId = null;
		this.damageType = 'projectile';
		this.deactiveBuffer = 50;
	}

	kill() {
		this.setActive(false);
		this.setVisible(false);

		if (this.body) {
			this.body.enable = false;
		}

		this.targetEnemyId = null;
	}

	fire(source, target, actualTarget = null) {
		this.activate(source, target, actualTarget);
		this.setMovement(source, target);
	}

	activate(source, target, actualTarget = null) {
		this.targetEnemyId = actualTarget?.id || null;
		this.setPosition(source.x, source.y);
		this.setActive(true);
		this.setVisible(true);

		if (this.body) this.body.enable = true;
	}

	setMovement(source, target) {
		this.scene.physics.moveToObject(this, target, this.speed);
		this.rotation = Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y);
	}

	update() {
		if (this.isOutOfBounds()) {
			this.kill();
		}
	}

	isOutOfBounds() {
		const { x, y, width, height } = this.scene.physics.world.bounds;
		return (
			this.x < x - this.deactiveBuffer ||
			this.x > x + width + this.deactiveBuffer ||
			this.y < y - this.deactiveBuffer ||
			this.y > y + height + this.deactiveBuffer
		);
	}
}
