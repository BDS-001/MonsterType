/**
 * Base Weapon Class
 *
 * Handles weapon firing mechanics, projectile spawning, and spread patterns.
 * Provides a foundation for different weapon types with customizable properties.
 */
export default class Weapon {
	/**
	 * Create a new weapon with specified properties
	 * @param {string} name - Weapon display name
	 * @param {string} description - Weapon description
	 * @param {Object} options - Weapon configuration options
	 * @param {number} options.attackSpeed - Milliseconds between shots (default: 1000)
	 * @param {number} options.projectileCount - Projectiles fired per shot (default: 1)
	 * @param {string} options.projectileType - Type of projectile to fire (default: 'basicShot')
	 * @param {number} options.spread - Spread angle in radians for multi-projectile weapons (default: 0)
	 */
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

	/**
	 * Check if enough time has passed since last shot to fire again
	 * @param {number} currentTime - Current game time in milliseconds
	 * @returns {boolean} True if weapon can fire now
	 */
	canFireNow(currentTime) {
		return currentTime - this.lastFireTime >= this.attackSpeed;
	}

	/**
	 * Attempt to fire the weapon towards a target
	 * @param {Phaser.Scene} scene - Game scene for context
	 * @param {ProjectileManager} projectileManager - Manager for creating projectiles
	 * @param {Object} source - Entity firing the weapon (has x, y coordinates)
	 * @param {Object} target - Target to aim at (has x, y coordinates)
	 * @param {number} currentTime - Current game time for rate limiting
	 * @returns {boolean} True if weapon fired successfully, false if on cooldown
	 */
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

	/**
	 * Calculate the angular offset for a projectile in a spread pattern
	 * @param {number} index - Index of current projectile (0 to totalCount-1)
	 * @param {number} totalCount - Total number of projectiles in spread
	 * @param {number} maxSpread - Maximum spread angle in radians
	 * @returns {number} Angular offset in radians for this projectile
	 */
	calculateSpreadOffset(index, totalCount, maxSpread) {
		if (totalCount === 1) return 0;

		const step = maxSpread / (totalCount - 1);
		return index * step - maxSpread / 2;
	}

	/**
	 * Apply spread offset to create a new target position
	 * @param {Object} originalTarget - Original target coordinates {x, y}
	 * @param {Object} source - Source coordinates {x, y}
	 * @param {number} spreadOffset - Angular offset in radians
	 * @returns {Object} New target coordinates {x, y}
	 */
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

	/**
	 * Get comprehensive weapon statistics for display or analysis
	 * @returns {Object} Object containing all weapon stats and calculated values
	 */
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
