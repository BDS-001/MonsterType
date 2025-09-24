import Weapon from './weapon.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Crossbow extends Weapon {
	constructor() {
		super('Crossbow', 'Fires bolts that ricochet between multiple enemies', {
			maxTargets: 1,
			attackAnimation: 'basic',
			maxUsages: 40,
		});
		this.ricochetCount = 3;
		this.range = 300;
	}

	shotEffect(primaryTarget) {
		const player = this.scene?.player;
		if (!player) return;

		primaryTarget.takeDamage();
		this.scene.events.emit(GAME_EVENTS.WEAPON_FIRED, {
			target: primaryTarget,
			weapon: this,
			originX: player.x,
			originY: player.y,
		});

		this.ricochet(primaryTarget.x, primaryTarget.y, new Set([primaryTarget]), this.ricochetCount);
	}

	ricochet(fromX, fromY, visited, remaining) {
		if (remaining === 0) return;

		const nextTarget = this.findClosestTarget(fromX, fromY, visited);
		if (!nextTarget) return;

		nextTarget.takeDamage();
		this.scene.events.emit(GAME_EVENTS.WEAPON_FIRED, {
			target: nextTarget,
			weapon: this,
			originX: fromX,
			originY: fromY,
		});

		visited.add(nextTarget);
		this.ricochet(nextTarget.x, nextTarget.y, visited, remaining - 1);
	}

	findClosestTarget(fromX, fromY, visited) {
		const bodies = this.scene.physics?.overlapCirc(fromX, fromY, this.range, true, false);
		if (!bodies) return null;

		let closest = null;
		let closestDist = Infinity;

		for (const body of bodies) {
			const target = body.gameObject;
			if (!target?.takeDamage || visited.has(target)) continue;

			const dist = (target.x - fromX) ** 2 + (target.y - fromY) ** 2;
			if (dist < closestDist) {
				closestDist = dist;
				closest = target;
			}
		}

		return closest;
	}
}
