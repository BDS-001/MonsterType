/**
 * Explosive Bomb Item
 *
 * Consumable explosive item that can be collected by typing "explode".
 * Provides area damage capability when used.
 */
import Item from './item.js';

/**
 * Explosive consumable item
 * Deals area damage when activated
 */
export default class Bomb extends Item {
	/**
	 * Create a new bomb item
	 * @param {Phaser.Scene} scene - The scene this bomb belongs to
	 * @param {number} x - X position for bomb placement
	 * @param {number} y - Y position for bomb placement
	 */
	constructor(scene, x, y) {
		super(scene, x, y, 'BOMB');
	}
}