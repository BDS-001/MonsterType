/**
 * Heavy Rounds Weapon Pickup Item
 *
 * Weapon upgrade pickup that can be collected by typing "heavy".
 * Provides enhanced ammunition or weapon capabilities when collected.
 */
import Item from './item.js';

/**
 * Heavy rounds weapon upgrade pickup
 * Enhances weapon damage or ammunition capacity
 */
export default class HeavyRoundsPickup extends Item {
	/**
	 * Create a new heavy rounds pickup item
	 * @param {Phaser.Scene} scene - The scene this heavy rounds pickup belongs to
	 * @param {number} x - X position for heavy rounds pickup placement
	 * @param {number} y - Y position for heavy rounds pickup placement
	 */
	constructor(scene, x, y) {
		super(scene, x, y, 'HEAVYROUNDS_PICKUP');
	}
}