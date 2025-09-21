export default class HealthBar {
	constructor(scene, x, y, initialHealth = 100, maxHealth = 100, width = 200, height = 24) {
		this.scene = scene;
		this.bar = new Phaser.GameObjects.Graphics(scene);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.value = initialHealth;
		this.maxValue = maxHealth;
		this.borderThickness = 0;
		this.borderOffset = this.borderThickness;
		this.cornerRadius = 4;
		this.p = (this.width - this.borderThickness * 2) / this.maxValue;

		this.draw();
		scene.add.existing(this.bar);
	}

	decrease(amount) {
		this.setValue(this.value - amount);
		return this.value === 0;
	}

	heal(amount) {
		this.setValue(this.value + amount);
	}

	resetToFull() {
		this.setValue(this.maxValue);
	}

	setValue(newValue) {
		this.value = Math.max(0, Math.min(this.maxValue, newValue));
		this.draw();
	}

	increaseMax(maxIncrease, healthIncrease) {
		this.maxValue += maxIncrease;
		this.p = (this.width - this.borderThickness * 2) / this.maxValue;
		this.setValue(this.value + healthIncrease);
	}

	draw() {
		this.bar.clear();

		if (this.borderThickness > 0) {
			this.bar.lineStyle(this.borderThickness, 0x444444, 1);
			this.bar.strokeRoundedRect(this.x, this.y, this.width, this.height, this.cornerRadius);
		}

		this.bar.fillStyle(0x222222);
		this.bar.fillRoundedRect(
			this.x + this.borderThickness,
			this.y + this.borderThickness,
			this.width - this.borderThickness * 2,
			this.height - this.borderThickness * 2,
			this.cornerRadius
		);

		const healthPercentage = this.value / this.maxValue;
		let healthColor;

		if (healthPercentage > 0.6) {
			healthColor = 0x4caf50;
		} else if (healthPercentage > 0.3) {
			healthColor = 0xff9800;
		} else {
			healthColor = 0xf44336;
		}

		const healthBarWidth = Math.floor((this.width - this.borderThickness * 2) * healthPercentage);

		if (healthBarWidth > 0) {
			this.bar.fillStyle(healthColor);
			this.bar.fillRoundedRect(
				this.x + this.borderThickness,
				this.y + this.borderThickness,
				healthBarWidth,
				this.height - this.borderThickness * 2,
				this.cornerRadius
			);
		}
	}
}
