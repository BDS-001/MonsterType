import Weapon from './weapon.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Shotgun extends Weapon {
	constructor() {
		super('Shotgun', 'Spreads pellets in a cone, hitting multiple enemies', {
			maxTargets: 1,
			attackAnimation: 'shotgun',
			maxUsages: 30,
		});
		this.halfAngle = 0.6;
		this.maxRange = 1200;
		this.pelletFxCount = 16;
	}

	shotEffect(primaryTarget) {
		primaryTarget.takeDamage();

		const secondaryTargets = this.findConeTargets(primaryTarget);
		secondaryTargets.forEach((target) => {
			target.takeDamage();
		});

		const player = this.scene?.player;
		this.scene.events.emit(GAME_EVENTS.WEAPON_FIRED, {
			target: primaryTarget,
			weapon: this,
			pelletFxCount: this.pelletFxCount,
			halfAngle: this.halfAngle,
			maxRange: this.maxRange,
			originX: player?.x || 0,
			originY: player?.y || 0,
		});
	}

	findConeTargets(primaryTarget) {
		const player = this.scene?.player;
		if (!player || !this.scene?.physics) return [];

		const bodies = this.scene.physics.overlapCirc(player.x, player.y, this.maxRange, true, false);
		if (!bodies || bodies.length === 0) return [];

		const dx = primaryTarget.x - player.x;
		const dy = primaryTarget.y - player.y;
		const dirLenSq = dx * dx + dy * dy;
		if (dirLenSq === 0) return [];

		const invDirLen = 1 / Math.sqrt(dirLenSq);
		const dirX = dx * invDirLen;
		const dirY = dy * invDirLen;
		const cosThreshSq = Math.cos(this.halfAngle) ** 2;

		const coneTargets = [];
		for (const body of bodies) {
			const target = body.gameObject;
			if (!target?.takeDamage || target === primaryTarget) continue;

			const ex = target.x - player.x;
			const ey = target.y - player.y;
			const distSq = ex * ex + ey * ey;
			if (distSq === 0) continue;

			const dot = dirX * ex + dirY * ey;
			if (dot <= 0) continue;
			if (dot * dot >= cosThreshSq * distSq) {
				coneTargets.push(target);
			}
		}

		return coneTargets;
	}
}
