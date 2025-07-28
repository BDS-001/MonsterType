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
	 * Create a heavy gun with high damage, slower fire rate
	 */
	constructor() {
		super(
			'Heavy Gun',
			'A powerful weapon that fires heavy rounds with high damage but slower fire rate.',
			{
				attackSpeed: 1200,
				projectileCount: 1,
				projectileType: 'heavyRounds',
				spread: 0,
			}
		);
	}
}
