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

		if (this.body) {
			this.body.enable = false;
		}

		this.targetEnemyId = null;
	}

	fire(source, target) {
		this.activate(source, target);
		this.setMovement(source, target);
	}

	activate(source, target) {
		this.targetEnemyId = target.id;
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
		const bounds = this.scene.physics.world.bounds;
		const expandedBounds = new Phaser.Geom.Rectangle(
			bounds.x - this.deactiveBuffer,
			bounds.y - this.deactiveBuffer,
			bounds.width + this.deactiveBuffer * 2,
			bounds.height + this.deactiveBuffer * 2
		);

		return !Phaser.Geom.Rectangle.Contains(expandedBounds, this.x, this.y);
	}
}
