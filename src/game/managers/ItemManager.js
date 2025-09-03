import Item from '../entities/items/item';
import Medkit from '../entities/items/medkit';
import Bomb from '../entities/items/bomb';
import HeavyRoundsPickup from '../entities/items/heavyRoundsPickup';
import HealthUp from '../entities/items/healthUp';
import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class ItemManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.items = scene.add.group({ runChildUpdate: true });
		this.currentItemId = 0;
		this.setupEventListeners();
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.ITEM_SPAWNED, (data) => {
			this.spawnItem(data);
		});
	}

	spawnItemsFromCounts(itemCounts) {
		Object.entries(itemCounts).forEach(([itemType, count]) => {
			for (let i = 0; i < count; i++) {
				const x = Math.random() * this.scene.game.config.width;
				const y = Math.random() * this.scene.game.config.height;
				this.spawnItem({ x, y, itemType });
			}
		});
	}

	spawnItem({ x, y, itemType }) {
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

	getItems() {
		return this.items;
	}

	getItemCount() {
		return this.items.getChildren().length;
	}

	destroy() {
		if (this.items) {
			this.items.clear(true, true);
			this.items = null;
		}
		super.destroy();
	}
}
