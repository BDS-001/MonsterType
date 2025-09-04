import Weapon from './weapon.js';

export default class LazerGun extends Weapon {
	constructor() {
		super('Lazer Gun', 'DISABLED - Needs beam implementation', {
			cooldown: 500,
			damage: 1,
			maxTargets: 1,
			projectileSprite: 'basicShot',
		});
		this.halfAngle = 0.6;
		this.maxRange = 1200;
		this.lazerFxCount = 16;
	}

	lazerEffect(primaryTarget, data) {
		primaryTarget.takeDamage(this.damage);
		const secondaryTargets = this.findConeTargets(primaryTarget);
		secondaryTargets.forEach((target) => {
			const impactX = target.x;
			const impactY = target.y;
			target.takeDamage(this.damage);
			this.scene.events.emit('weapon:fired', {
				target,
				projectileSprite: this.projectileSprite,
				impactX,
				impactY,
			});
		});
		const scene = this.scene;
		const player = scene?.player;
		if (!player) return;

		const dx = primaryTarget.x - player.x;
		const dy = primaryTarget.y - player.y;
		const centerAngle = Math.atan2(dy, dx);
		const halfConeAngle = this.halfAngle;

		const cam = scene.cameras?.main;
		const far = cam ? Math.hypot(cam.width, cam.height) + 200 : 1600;
		for (let i = 0; i < this.lazerFxCount; i++) {
			const rand = (Math.random() * 2 - 1) * halfConeAngle;
			const ang = centerAngle + rand;
			const impactX = player.x + Math.cos(ang) * far;
			const impactY = player.y + Math.sin(ang) * far;
			scene.events.emit('weapon:fired', {
				projectileSprite: this.projectileSprite,
				impactX,
				impactY,
			});
		}
	}

	findConeTargets(primaryTarget) {
		const scene = this.scene;
		const player = scene?.player;
		if (!player) return [];

		const enemyGroup = scene?.enemyManager?.getEnemies?.();
		const enemies = enemyGroup ? enemyGroup.getChildren() : [];
		if (!enemies || enemies.length === 0) return [];

		const dx = primaryTarget.x - player.x;
		const dy = primaryTarget.y - player.y;
		const dirLenSq = dx * dx + dy * dy;
		if (dirLenSq === 0) return [];

		const invDirLen = 1 / Math.sqrt(dirLenSq);
		const dirX = dx * invDirLen;
		const dirY = dy * invDirLen;

		const maxRange = this.maxRange;
		const maxRangeSq = maxRange * maxRange;
		const cosThreshSq = Math.cos(this.halfAngle) ** 2;

		const coneTargets = [];
		for (const target of enemies) {
			if (target === primaryTarget) continue;

			const ex = target.x - player.x;
			const ey = target.y - player.y;
			const distSq = ex * ex + ey * ey;
			if (distSq > maxRangeSq || distSq === 0) continue;

			const dot = dirX * ex + dirY * ey;
			if (dot <= 0) continue;
			if (dot * dot >= cosThreshSq * distSq) {
				coneTargets.push(target);
			}
		}

		return coneTargets;
	}
}
