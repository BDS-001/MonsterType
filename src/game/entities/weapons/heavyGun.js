/**
 * Heavy Gun Weapon
 *
 * High-damage weapon with slower fire rate and heavy projectiles.
 * Designed for taking down tougher enemies with increased damage output.
 */
import Weapon from './weapon.js';

/**
 * Heavy weapon that fires powerful rounds at a slower rate
 * High damage output compensates for reduced fire rate
 */
export default class HeavyGun extends Weapon {
	/**
	 * Create a new heavy gun weapon
	 * Configured for high damage at the cost of slower firing speed
	 */
	constructor() {
		super(
			'Heavy Gun',
			'A powerful weapon that fires heavy rounds with high damage but slower fire rate.',
			{
				attackSpeed: 1200, // 1200ms between shots (0.83 shots per second)
				projectileCount: 1, // Single powerful projectile per shot
				projectileType: 'heavyRounds', // Uses high-damage projectiles
				spread: 0, // Perfect accuracy for precision shots
			}
		);
	}
}
