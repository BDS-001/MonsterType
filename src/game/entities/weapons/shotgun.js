import Weapon from './weapon.js';

export default class Shotgun extends Weapon {
	constructor() {
		super('Shotgun', 'DISABLED - Needs spread implementation', {
			cooldown: 500,
			damage: 1,
			maxTargets: 1,
			attackAnimation: 'shotgun',
		});
		this.halfAngle = 0.6;
		this.maxRange = 1200;
		this.pelletFxCount = 16;
	}

	shotEffect(primaryTarget) {
		primaryTarget.takeDamage(this.damage);
		const secondaryTargets = this.findConeTargets(primaryTarget);
		secondaryTargets.forEach((target) => {
			target.takeDamage(this.damage);
		});

		this.scene.events.emit('weapon:fired', {
			target: primaryTarget,
			weapon: this,
			pelletFxCount: this.pelletFxCount,
			halfAngle: this.halfAngle,
		});
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
