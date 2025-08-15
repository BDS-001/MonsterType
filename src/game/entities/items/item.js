import TypedEntity from '../typedEntity';
import { ITEM_DATA } from '../../core/itemData.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Item extends TypedEntity {
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
		this.baseValue = itemData.baseValue || null;

		scene.add.existing(this);
		scene.physics.add.existing(this);
	}

	update() {
		if (this.isDestroyed) return;
		this.updateTextPositions();
	}

	onKill() {
		this.scene.events.emit(GAME_EVENTS.ITEM_DESTROYED, { item: this });
	}

	destroy(fromScene) {
		super.destroy(fromScene);
	}
}
