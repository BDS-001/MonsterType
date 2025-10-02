import Item from '../entities/items/item';
import Medkit from '../entities/items/medkit';
import Bomb from '../entities/items/bomb';
import HealthUp from '../entities/items/healthUp';
import RandomWeaponDrop from '../entities/items/randomWeaponDrop';
import Shield from '../entities/items/shield';
import Blizzard from '../entities/items/blizzard';
import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class ItemManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.items = scene.add.group({ runChildUpdate: false });
		this.currentItemId = 0;
		this.setupEventListeners();
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.ITEM_SPAWNED, (data) => {
			this.spawnItem(data);
		});
	}

	update(delta) {
		const children = this.items.children.entries;
		for (let i = 0; i < children.length; i++) {
			const item = children[i];
			if (item && !item.isDestroyed && item.update) {
				item.update(delta);
			}
		}
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

		const camera = this.scene.cameras.main;
		const margin = 80;
		const adjustedX = Math.max(
			camera.scrollX + margin,
			Math.min(x, camera.scrollX + camera.width - margin)
		);
		const adjustedY = Math.max(
			camera.scrollY + margin,
			Math.min(y, camera.scrollY + camera.height - margin)
		);

		let item;

		switch (itemType) {
			case 'MEDKIT':
				item = new Medkit(this.scene, adjustedX, adjustedY, itemId);
				break;
			case 'BOMB':
				item = new Bomb(this.scene, adjustedX, adjustedY, itemId);
				break;
			case 'SHIELD':
				item = new Shield(this.scene, adjustedX, adjustedY, itemId);
				break;
			case 'HEALTH_UP':
				item = new HealthUp(this.scene, adjustedX, adjustedY, itemId);
				break;
			case 'RANDOM_WEAPON_DROP':
				item = new RandomWeaponDrop(this.scene, adjustedX, adjustedY, itemId);
				break;
			case 'BLIZZARD':
				item = new Blizzard(this.scene, adjustedX, adjustedY, itemId);
				break;
			default:
				item = new Item(this.scene, adjustedX, adjustedY, itemType, itemId);
		}

		if (!item) {
			console.error(`Failed to create item of type: ${itemType}`);
			return null;
		}

		this.currentItemId++;

		if (!this.items) {
			console.error('ItemManager items group is null');
			return null;
		}

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
		this.destroyGroup(this.items);
		this.items = null;
		super.destroy();
	}
}
