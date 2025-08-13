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

		// Safely disable physics body
		if (this.body) {
			this.body.enable = false;
		}

		this.targetEnemyId = null;
	}

	fire(source, target) {
		this.targetEnemyId = target.id;

		// Safely enable physics body
		if (this.body) {
			this.body.enable = true;
		}

		this.setActive(true);
		this.setVisible(true);
		this.setPosition(source.x, source.y);

		this.scene.physics.moveToObject(this, target, this.speed);
		this.rotation = Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y);
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
