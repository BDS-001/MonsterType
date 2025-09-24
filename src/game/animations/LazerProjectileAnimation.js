import ProjectileAnimation from './ProjectileAnimation.js';

export default class LazerProjectileAnimation extends ProjectileAnimation {
	constructor(scene, config = {}) {
		super(scene);
		this.lazerLength = config.lazerLength ?? 1500;
		this.lazerWidth = config.lazerWidth ?? 60;
		this.lineWidth = config.lineWidth ?? 3;
		this.lineColor = config.lineColor ?? 0xff0000;
		this.fillColor = config.fillColor ?? 0xff0000;
		this.lineAlpha = config.lineAlpha ?? 0.8;
		this.fillAlpha = config.fillAlpha ?? 0.3;
		this.fadeDuration = config.fadeDuration ?? 300;
	}

	animate(data) {
		if (!this.validateData(data)) return;

		const { target, lazerLength, lazerWidth, originX, originY } = data;

		if (lazerLength) this.lazerLength = lazerLength;
		if (lazerWidth) this.lazerWidth = lazerWidth;

		const angle = Phaser.Math.Angle.Between(originX, originY, target.x, target.y);

		this.createLazerBeam(originX, originY, angle);
	}

	createLazerBeam(originX, originY, angle) {
		const lazer = this.scene.add.graphics();
		lazer.lineStyle(this.lazerWidth, this.lineColor, this.lineAlpha);

		const endX = originX + Math.cos(angle) * this.lazerLength;
		const endY = originY + Math.sin(angle) * this.lazerLength;

		lazer.beginPath();
		lazer.moveTo(originX, originY);
		lazer.lineTo(endX, endY);
		lazer.strokePath();

		this.animateLazerFade(lazer);
	}

	animateLazerFade(lazer) {
		this.scene.tweens.add({
			targets: lazer,
			alpha: 0,
			duration: this.fadeDuration,
			ease: 'Power2',
			onComplete: () => lazer.destroy(),
		});
	}
}
