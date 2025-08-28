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
			console.log('ItemManager received ITEM_SPAWNED event:', data);
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
		console.log('ItemManager.spawnItem called:', { x, y, itemType });
		if (!this.items || !this.scene || !this.scene.add || !this.scene.add.existing) {
			console.error('ItemManager.spawnItem: invalid state', {
				items: this.items,
				scene: this.scene,
				sceneAdd: this.scene?.add,
				sceneAddExisting: this.scene?.add?.existing,
			});
			return null;
		}

		if (!this.items.add) {
			console.error('ItemManager.spawnItem: items group missing add method', this.items);
			return null;
		}

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
		console.log('ItemManager: item added successfully');
		return item;
	}

	getItems() {
		return this.items;
	}

	getItemCount() {
		return this.items.getChildren().length;
	}

	destroy() {
		console.log('ItemManager.destroy called');
		this.unsubscribeAll();
		if (this.items) {
			this.items.clear(true, true);
			this.items = null;
		}
	}
}
