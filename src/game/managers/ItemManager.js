import CompositeItem from '../entities/CompositeItem.js';
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

	spawnItemsFromSpawns(itemSpawns = []) {
		for (const entry of itemSpawns) {
			const count = entry.count ?? 1;
			for (let i = 0; i < count; i++) {
				const x = Math.random() * this.scene.game.config.width;
				const y = Math.random() * this.scene.game.config.height;
				this.spawnItem({ x, y, itemType: entry.type });
			}
		}
	}

	spawnItem({ x, y, itemType }) {
		const itemId = `item${this.currentItemId}`;
		const item = new CompositeItem(this.scene, x, y, itemType, itemId);

		this.currentItemId++;

		if (!this.items) {
			throw new Error('ItemManager: items group is null');
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
		if (this.items) {
			this.items.clear(true, true);
			this.items = null;
		}
		super.destroy();
	}
}
