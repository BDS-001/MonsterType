export default class Weapon {
	constructor(name, description, options = {}) {
		this.name = name;
		this.description = description;
		
		// Firing properties
		this.attackSpeed = options.attackSpeed || 1000; // milliseconds between shots
		this.projectileCount = options.projectileCount || 1; // projectiles per shot
		this.projectileType = options.projectileType || 'basicShot'; // which projectile to use
		this.spread = options.spread || 0; // spread angle in radians for multiple projectiles
		
		// State tracking
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
		
		// Fire projectiles based on projectileCount and spread
		for (let i = 0; i < this.projectileCount; i++) {
			const projectile = projectileManager.getProjectile(this.projectileType);
			
			if (this.projectileCount === 1) {
				// Single projectile - fire directly at target
				projectile.fire(source, target);
			} else {
				// Multiple projectiles - apply spread
				const spreadOffset = this.calculateSpreadOffset(i, this.projectileCount, this.spread);
				const adjustedTarget = this.applySpreadToTarget(target, source, spreadOffset);
				projectile.fire(source, adjustedTarget);
			}
		}
		
		return true;
	}

	calculateSpreadOffset(index, totalCount, maxSpread) {
		if (totalCount === 1) return 0;
		
		// Distribute projectiles evenly across the spread angle
		const step = maxSpread / (totalCount - 1);
		return (index * step) - (maxSpread / 2);
	}

	applySpreadToTarget(originalTarget, source, spreadOffset) {
		// Calculate direction from source to target
		const dx = originalTarget.x - source.x;
		const dy = originalTarget.y - source.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		
		// Get current angle
		const currentAngle = Math.atan2(dy, dx);
		
		// Apply spread offset
		const newAngle = currentAngle + spreadOffset;
		
		// Calculate new target position
		return {
			x: source.x + Math.cos(newAngle) * distance,
			y: source.y + Math.sin(newAngle) * distance
		};
	}

	getStats() {
		return {
			name: this.name,
			description: this.description,
			attackSpeed: this.attackSpeed,
			projectileCount: this.projectileCount,
			projectileType: this.projectileType,
			fireRate: Math.round(60000 / this.attackSpeed) // shots per minute
		};
	}
}