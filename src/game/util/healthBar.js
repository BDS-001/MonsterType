import gameState from '../core/gameState';

export default class HealthBar {
	constructor(scene, x, y, width = 150, height = 30) {
		this.bar = new Phaser.GameObjects.Graphics(scene);

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.value = gameState.player.health;
		this.borderThickness = 8;
		this.borderOffset = this.borderThickness / 2;
		this.p = (this.width - this.borderThickness) / this.value;

		this.draw();

		scene.add.existing(this.bar);
	}

	decrease(amount) {
		this.value -= amount;

		if (this.value < 0) {
			this.value = 0;
		}

		this.draw();

		return this.value === 0;
	}

	draw() {
		this.bar.clear();

		//  BG
		this.bar.fillStyle(0x000000);
		this.bar.fillRect(this.x, this.y, this.width, this.height);

		//  Health

		this.bar.fillStyle(0xffffff);
		this.bar.fillRect(
			this.x + this.borderOffset,
			this.y + this.borderOffset,
			this.width - this.borderThickness,
			this.height - this.borderThickness
		);

		if (this.value < 30) {
			this.bar.fillStyle(0xff0000);
		} else {
			this.bar.fillStyle(0x00ff00);
		}

		var d = Math.floor(this.p * this.value);

		this.bar.fillRect(
			this.x + this.borderOffset,
			this.y + this.borderOffset,
			d,
			this.height - this.borderThickness
		);
	}
}
