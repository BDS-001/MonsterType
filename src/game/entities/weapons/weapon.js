import Phaser from 'phaser';

export default class Weapon {
	constructor(name, description, options = {}) {
		this.name = name;
		this.description = description;

		this.cooldown = options.cooldown ?? 1000;
		this.projectileType = options.projectileType || 'basicShot';
		this.projectileDamage = options.projectileDamage || 1;
		this.spread = options.spread || 0;
		this.maxTargets = options.maxTargets || 1;
		this.projectilesPerTarget = options.projectilesPerTarget || 1;

		this.lastFireTime = 0;
	}

	canFireNow(currentTime) {
		return this.cooldown === 0 || currentTime - this.lastFireTime >= this.cooldown;
	}

	fire(projectileManager, source, targets, currentTime) {
		if (!this.canFireNow(currentTime)) return false;

		this.lastFireTime = currentTime;
		let projectilesFired = 0;

		for (const target of targets) {
			for (let i = 0; i < this.projectilesPerTarget; i++) {
				const projectile = projectileManager.getProjectile(this.projectileType);
				if (!projectile) continue;

				projectile.damage = this.projectileDamage;

				const firingTarget =
					this.projectilesPerTarget === 1 ? target : this.calculateSpreadTarget(target, source, i);

				const actualTarget = i === 0 ? target : null;

				projectile.fire(source, firingTarget, actualTarget);
				projectilesFired++;
			}
		}

		return projectilesFired > 0;
	}

	calculateSpreadTarget(target, source, index) {
		const spreadOffset = this.getSpreadAngle(index);
		const distance = Phaser.Math.Distance.Between(source.x, source.y, target.x, target.y);
		const baseAngle = Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y);
		const finalAngle = baseAngle + spreadOffset;

		return {
			x: source.x + Math.cos(finalAngle) * distance,
			y: source.y + Math.sin(finalAngle) * distance,
		};
	}

	getSpreadAngle(index) {
		if (this.projectilesPerTarget === 1) return 0;
		const step = this.spread / (this.projectilesPerTarget - 1);
		return index * step - this.spread / 2;
	}

	getStats() {
		return {
			name: this.name,
			description: this.description,
			cooldown: this.cooldown,
			projectilesPerTarget: this.projectilesPerTarget,
			projectileType: this.projectileType,
			fireRate: this.cooldown > 0 ? Math.round(60000 / this.cooldown) : Infinity,
		};
	}
}
