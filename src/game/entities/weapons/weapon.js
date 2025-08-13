import Phaser from 'phaser';

export default class Weapon {
	constructor(name, description, options = {}) {
		this.name = name;
		this.description = description;

		this.attackSpeed = options.attackSpeed || 1000;
		this.projectileCount = options.projectileCount || 1;
		this.projectileType = options.projectileType || 'basicShot';
		this.spread = options.spread || 0;

		this.lastFireTime = 0;
	}

	canFireNow(currentTime) {
		return currentTime - this.lastFireTime >= this.attackSpeed;
	}

	fire(projectileManager, source, target, currentTime) {
		if (!this.canFireNow(currentTime)) return false;

		this.lastFireTime = currentTime;

		for (let i = 0; i < this.projectileCount; i++) {
			const projectile = projectileManager.getProjectile(this.projectileType);
			if (!projectile) continue;

			const firingTarget =
				this.projectileCount === 1 ? target : this.calculateSpreadTarget(target, source, i);

			projectile.fire(source, firingTarget);
		}

		return true;
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
		if (this.projectileCount === 1) return 0;
		const step = this.spread / (this.projectileCount - 1);
		return index * step - this.spread / 2;
	}

	getStats() {
		return {
			name: this.name,
			description: this.description,
			attackSpeed: this.attackSpeed,
			projectileCount: this.projectileCount,
			projectileType: this.projectileType,
			fireRate: Math.round(60000 / this.attackSpeed),
		};
	}
}
