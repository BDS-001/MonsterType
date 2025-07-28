/**
 * Collectible Item Entity
 *
 * Base class for items that can be collected by typing their associated words.
 * Extends TypedEntity to provide item-specific properties and behaviors.
 */
import TypedEntity from '../typedEntity';
import { ITEM_DATA } from '../../core/itemData.js';

/**
 * Collectible item with word-based interaction
 * Provides power-ups, upgrades, or other benefits when collected
 */
export default class Item extends TypedEntity {
	/**
	 * Create a new collectible item
	 * @param {Phaser.Scene} scene - The scene this item belongs to
	 * @param {number} x - X position for item placement
	 * @param {number} y - Y position for item placement
	 * @param {string} itemType - Item type identifier from ITEM_DATA
	 * @param {string} itemId - Unique compound ID for this item instance
	 */
	constructor(scene, x, y, itemType, itemId) {
		const itemData = ITEM_DATA[itemType];
		if (!itemData) {
			throw new Error(`Item data not found for type: ${itemType}`);
		}

		super(scene, x, y, 'item-sprite', itemData.word, itemId);

		this.itemType = itemType;
		this.name = itemData.name;
		this.type = itemData.type;
		this.rarity = itemData.rarity;

		scene.add.existing(this);
		scene.physics.add.existing(this);
	}
}
