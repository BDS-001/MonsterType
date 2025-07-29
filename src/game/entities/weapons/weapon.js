export default class Weapon {
	constructor(name, description, options = {}) {
		this.name = name;
		this.description = description;

		this.attackSpeed = options.attackSpeed || 1000;
		this.projectileCount = options.projectileCount || 1;
		this.projectileType = options.projectileType || 'basicShot';
		this.spread = options.spread || 0;

		this.lastFireTime = 0;
		this.canFire = true;
	}

	canFireNow(currentTime) {
		return currentTime - this.lastFireTime >= this.attackSpeed;
	}

	fire(scene, projectileManager, source, target, currentTime) {
		if (!this.canFireNow(currentTime)) {
			return false;
		}

		this.lastFireTime = currentTime;

		for (let i = 0; i < this.projectileCount; i++) {
			const projectile = projectileManager.getProjectile(this.projectileType);

			if (this.projectileCount === 1) {
				projectile.fire(source, target);
			} else {
				const spreadOffset = this.calculateSpreadOffset(i, this.projectileCount, this.spread);
				const adjustedTarget = this.applySpreadToTarget(target, source, spreadOffset);
				projectile.fire(source, adjustedTarget);
			}
		}

		return true;
	}

	calculateSpreadOffset(index, totalCount, maxSpread) {
		if (totalCount === 1) return 0;

		const step = maxSpread / (totalCount - 1);
		return index * step - maxSpread / 2;
	}

	applySpreadToTarget(originalTarget, source, spreadOffset) {
		const dx = originalTarget.x - source.x;
		const dy = originalTarget.y - source.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const currentAngle = Math.atan2(dy, dx);
		const newAngle = currentAngle + spreadOffset;

		return {
			x: source.x + Math.cos(newAngle) * distance,
			y: source.y + Math.sin(newAngle) * distance,
		};
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
