/**
 * Health Upgrade Item
 *
 * Permanent health increase upgrade that can be collected by typing "endurance".
 * Provides a permanent boost to maximum health when collected.
 */
import Item from './item.js';

/**
 * Permanent health upgrade item
 * Increases maximum health capacity when collected
 */
export default class HealthUp extends Item {
	/**
	 * Create a new health upgrade item
	 * @param {Phaser.Scene} scene - The scene this health upgrade belongs to
	 * @param {number} x - X position for health upgrade placement
	 * @param {number} y - Y position for health upgrade placement
	 * @param {string} itemId - Unique compound ID for this item instance
	 */
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'HEALTH_UP', itemId);
	}
}
