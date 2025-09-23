import BasicProjectileAnimation from './BasicProjectileAnimation.js';
import { gameSettings } from '../core/constants.js';

export default class ShotgunProjectileAnimation extends BasicProjectileAnimation {
	constructor(scene, config = {}) {
		super(scene);
		this.pelletFxCount = config.pelletFxCount ?? 16;
		this.halfAngle = config.halfAngle ?? 0.6;
	}

	animate(data) {
		const { impactX, impactY, pelletFxCount, halfAngle } = data;

		if (pelletFxCount) this.pelletFxCount = pelletFxCount;
		if (halfAngle) this.halfAngle = halfAngle;

		if (impactX != null && impactY != null) {
			this.animateSinglePellet({ impactX, impactY });
		} else {
			this.animateSpreadPattern(data);
		}
	}

	animateSinglePellet(data) {
		const { impactX, impactY, originX, originY } = data;

		const sprite = this.scene.add.sprite(originX, originY, 'basicShot');
		sprite.setScale(gameSettings.SPRITE_SCALE);

		const angle = Phaser.Math.Angle.Between(originX, originY, impactX, impactY);
		sprite.setRotation(angle);

		this.animateProjectileMovement(sprite, originX, originY, impactX, impactY);
	}

	animateSpreadPattern(data) {
		const { target, originX, originY } = data;

		if (!target) return;

		const centerAngle = this.calculateCenterAngle(originX, originY, target);
		const maxDistance = this.calculateMaxDistance();

		for (let i = 0; i < this.pelletFxCount; i++) {
			const angle = this.calculatePelletAngle(centerAngle);
			const impactPoint = this.calculateImpactPoint(originX, originY, angle, maxDistance);

			this.animateSinglePellet({
				impactX: impactPoint.x,
				impactY: impactPoint.y,
				originX,
				originY,
			});
		}
	}

	calculateCenterAngle(originX, originY, target) {
		const dx = target.x - originX;
		const dy = target.y - originY;
		return Math.atan2(dy, dx);
	}

	calculateMaxDistance() {
		const cam = this.scene.cameras?.main;
		return cam ? Math.hypot(cam.width, cam.height) + 200 : 1600;
	}

	calculatePelletAngle(centerAngle) {
		const rand = (Math.random() * 2 - 1) * this.halfAngle;
		return centerAngle + rand;
	}

	calculateImpactPoint(originX, originY, angle, distance) {
		return {
			x: originX + Math.cos(angle) * distance,
			y: originY + Math.sin(angle) * distance,
		};
	}
}
