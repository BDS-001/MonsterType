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
		const { impactX, impactY } = data;
		const player = this.getPlayer();

		const sprite = this.scene.add.sprite(player.x, player.y, 'basicShot');
		sprite.setScale(gameSettings.SPRITE_SCALE);

		const angle = Phaser.Math.Angle.Between(player.x, player.y, impactX, impactY);
		sprite.setRotation(angle);

		this.animateProjectileMovement(sprite, player, impactX, impactY);
	}

	animateSpreadPattern(data) {
		const { target } = data;
		const player = this.getPlayer();

		if (!player || !target) return;

		const centerAngle = this.calculateCenterAngle(player, target);
		const maxDistance = this.calculateMaxDistance();

		for (let i = 0; i < this.pelletFxCount; i++) {
			const angle = this.calculatePelletAngle(centerAngle);
			const impactPoint = this.calculateImpactPoint(player, angle, maxDistance);

			this.animateSinglePellet({
				impactX: impactPoint.x,
				impactY: impactPoint.y,
			});
		}
	}

	calculateCenterAngle(player, target) {
		const dx = target.x - player.x;
		const dy = target.y - player.y;
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

	calculateImpactPoint(player, angle, distance) {
		return {
			x: player.x + Math.cos(angle) * distance,
			y: player.y + Math.sin(angle) * distance,
		};
	}
}
