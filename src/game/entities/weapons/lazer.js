import Weapon from './weapon.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class LazerGun extends Weapon {
	constructor() {
		super('Lazer Gun', 'Powerful laser beam that pierces through multiple enemies in a line', {
			maxTargets: 1,
			attackAnimation: 'lazer',
			maxUsages: 20,
		});
		this.lazerLength = 1500;
		this.lazerWidth = 60;
	}

	shotEffect(primaryTarget) {
		const player = this.scene?.player;
		if (!player) return;

		primaryTarget.takeDamage();
		this.damageEnemiesInLine(primaryTarget, player);

		this.scene.events.emit(GAME_EVENTS.WEAPON_FIRED, {
			target: primaryTarget,
			weapon: this,
			lazerLength: this.lazerLength,
			lazerWidth: this.lazerWidth,
			originX: player.x,
			originY: player.y,
		});
	}

	damageEnemiesInLine(primaryTarget, player) {
		if (!this.scene?.physics) return;

		const bodies = this.scene.physics.overlapCirc(
			player.x,
			player.y,
			this.lazerLength,
			true,
			false
		);
		if (!bodies || bodies.length === 0) return;

		const angle = Phaser.Math.Angle.Between(player.x, player.y, primaryTarget.x, primaryTarget.y);
		const laserDirX = Math.cos(angle);
		const laserDirY = Math.sin(angle);

		for (const body of bodies) {
			const target = body.gameObject;
			if (!target?.takeDamage || target.id === primaryTarget.id) continue;

			const toTargetX = target.x - player.x;
			const toTargetY = target.y - player.y;

			const dotProduct = toTargetX * laserDirX + toTargetY * laserDirY;
			if (dotProduct <= 0) continue;

			const distanceToLaser = Math.abs(toTargetX * laserDirY - toTargetY * laserDirX);
			if (distanceToLaser <= this.lazerWidth) {
				target.takeDamage();
			}
		}
	}
}
