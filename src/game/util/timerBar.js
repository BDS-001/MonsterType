export default class TimerBar {
	constructor(scene, x, y, totalMs = 5000, width = 360, height = 10) {
		this.scene = scene;
		this.bar = new Phaser.GameObjects.Graphics(scene);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.totalMs = Math.max(1, totalMs);
		this.remainingMs = totalMs;
		this.borderThickness = 3;
		this.frozen = false;

		this.draw();
		scene.add.existing(this.bar);
	}

	setFrozen(frozen) {
		this.frozen = !!frozen;
		this.draw();
	}

	setWindow(totalMs, remainingMs) {
		this.totalMs = Math.max(1, totalMs || 1);
		this.remainingMs = Math.max(0, Math.min(this.totalMs, remainingMs || 0));
		this.draw();
	}

	setVisible(visible) {
		this.bar.setVisible(visible);
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.draw();
	}

	destroy() {
		this.bar?.destroy();
	}

	draw() {
		const innerWidth = this.width - this.borderThickness * 2;
		const innerHeight = this.height - this.borderThickness * 2;

		this.bar.clear();

		this.bar.fillStyle(0x000000);
		this.bar.fillRect(this.x, this.y, this.width, this.height);

		this.bar.fillStyle(0x1a1a1a);
		this.bar.fillRect(
			this.x + this.borderThickness,
			this.y + this.borderThickness,
			innerWidth,
			innerHeight
		);

		const ratio = this.remainingMs / this.totalMs;
		const fillWidth = Math.floor(innerWidth * ratio);

		let color = 0x00e5ff;
		if (!this.frozen) {
			if (ratio <= 0.33) {
				color = 0xff1744;
			} else if (ratio <= 0.66) {
				color = 0xffd54f;
			}
		} else {
			color = 0x66ccff;
		}

		if (fillWidth > 0) {
			this.bar.fillStyle(color);
			this.bar.fillRect(
				this.x + this.borderThickness,
				this.y + this.borderThickness,
				fillWidth,
				innerHeight
			);

			if (this.frozen) {
				this.bar.fillStyle(0xffffff, 0.15);
				this.bar.fillRect(
					this.x + this.borderThickness,
					this.y + this.borderThickness,
					fillWidth,
					2
				);
			}
		}

		if (this.frozen) {
			this.bar.lineStyle(2, 0x66ccff, 1);
			this.bar.strokeRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
			this.bar.lineStyle();
		}
	}
}
