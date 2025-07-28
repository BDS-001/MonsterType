/**
 * Medical Kit Item
 *
 * Consumable health restoration item that can be collected by typing "heal".
 * Provides immediate health recovery when used.
 */
import Item from './item.js';
import gameState from '../../core/gameState.js';

/**
 * Health restoration consumable item
 * Restores health when collected and used
 */
export default class Medkit extends Item {
	/**
	 * Create a new medkit item
	 * @param {Phaser.Scene} scene - The scene this medkit belongs to
	 * @param {number} x - X position for medkit placement
	 * @param {number} y - Y position for medkit placement
	 * @param {string} itemId - Unique compound ID for this item instance
	 */
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'MEDKIT', itemId);
		this.healAmount = this.baseValue;
	}

	/**
	 * Apply healing effect when item is collected
	 */
	onKill() {
		gameState.playerHeal(this.healAmount);
		return;
	}
}
