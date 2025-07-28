/**
 * Item Management System
 *
 * Handles item spawning, collision detection, and management.
 * Manages different item types with unique compound string IDs.
 */
import Item from '../entities/items/item';
import Medkit from '../entities/items/medkit';
import Bomb from '../entities/items/bomb';
import HeavyRoundsPickup from '../entities/items/heavyRoundsPickup';
import HealthUp from '../entities/items/healthUp';

/**
 * Central manager for all item-related operations
 * Controls spawning patterns, item lifecycle, and collision detection
 */
export default class ItemManager {
	/**
	 * Initialize item management system
	 * @param {Phaser.Scene} scene - The scene to manage items in
	 */
	constructor(scene) {
		this.scene = scene;
		this.items = null;
		this.currentItemId = 0;

		this.setupItems();
	}

	/**
	 * Initialize the item group container
	 * Sets up a Phaser group to manage all active items
	 */
	setupItems() {
		this.items = this.scene.add.group();
	}

	/**
	 * Spawn an item at specified coordinates
	 * @param {number} x - X coordinate for item spawn
	 * @param {number} y - Y coordinate for item spawn
	 * @param {string} itemType - Item type identifier from ITEM_DATA
	 */
	spawnItem(x, y, itemType) {
		const itemId = `item${this.currentItemId}`;
		let item;

		switch (itemType) {
			case 'MEDKIT':
				item = new Medkit(this.scene, x, y, itemId);
				break;
			case 'BOMB':
				item = new Bomb(this.scene, x, y, itemId);
				break;
			case 'HEAVYROUNDS_PICKUP':
				item = new HeavyRoundsPickup(this.scene, x, y, itemId);
				break;
			case 'HEALTH_UP':
				item = new HealthUp(this.scene, x, y, itemId);
				break;
			default:
				item = new Item(this.scene, x, y, itemType, itemId);
		}

		this.currentItemId++;
		this.items.add(item);
		return item;
	}

	/**
	 * Update all items and handle input processing
	 * @param {string|null} currentKey - The key currently being pressed
	 */
	update(currentKey) {
		const currentItems = this.items.getChildren();

		for (let i = currentItems.length - 1; i >= 0; i--) {
			const item = currentItems[i];
			item.update(currentKey);
		}
	}

	/**
	 * Get the item group for collision detection or other operations
	 * @returns {Phaser.GameObjects.Group} The group containing all active items
	 */
	getItems() {
		return this.items;
	}

	/**
	 * Get the current number of active items
	 * @returns {number} Count of items currently in the scene
	 */
	getItemCount() {
		return this.items.getChildren().length;
	}

	/**
	 * Clean up all items
	 * Should be called when the scene ends or game resets
	 */
	destroy() {
		if (this.items) {
			this.items.clear(true, true);
		}
	}
}
