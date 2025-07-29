import Item from '../entities/items/item';
import Medkit from '../entities/items/medkit';
import Bomb from '../entities/items/bomb';
import HeavyRoundsPickup from '../entities/items/heavyRoundsPickup';
import HealthUp from '../entities/items/healthUp';

export default class ItemManager {
	constructor(scene) {
		this.scene = scene;
		this.items = null;
		this.currentItemId = 0;

		this.setupItems();
	}

	setupItems() {
		this.items = this.scene.add.group();
	}

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

	update(currentKey) {
		const currentItems = this.items.getChildren();

		for (let i = currentItems.length - 1; i >= 0; i--) {
			const item = currentItems[i];
			item.update(currentKey);
		}
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
		}
	}
}
