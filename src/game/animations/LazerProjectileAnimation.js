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
		lazer.setPosition(originX, originY);
		lazer.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha);
		lazer.fillStyle(this.fillColor, this.fillAlpha);
		lazer.fillRect(0, 0, this.lazerLength, this.lazerWidth);
		lazer.rotation = angle;

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
