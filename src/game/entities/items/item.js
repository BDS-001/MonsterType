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
	 * @param {string|number} itemId - Identifier for item type in ITEM_DATA
	 */
	constructor(scene, x, y, itemId) {
		// Retrieve item configuration from data table
		const itemData = ITEM_DATA[itemId];
		if (!itemData) {
			throw new Error(`Item data not found for id: ${itemId}`);
		}

		// Initialize as TypedEntity with item sprite and word
		super(scene, x, y, 'item-sprite', itemData.word);

		// Store item properties from data configuration
		this.id = itemData.id; // Unique item identifier
		this.name = itemData.name; // Display name
		this.word = itemData.word; // Word to type for collection
		this.type = itemData.type; // Item category (weapon, health, etc.)
		this.rarity = itemData.rarity; // Rarity level affecting spawn chance

		// Register with scene systems
		scene.add.existing(this);
		scene.physics.add.existing(this);
	}
}
