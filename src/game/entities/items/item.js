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

		this.scene.events.on(GAME_EVENTS.TYPING_INPUT, this.handleTypingInput, this);
	}

	handleTypingInput(data) {
		if (this.isDestroyed) return;
		super.update(data.key);
	}

	update() {
		if (this.isDestroyed) return;
		this.updateTextPositions();
	}

	destroy(fromScene) {
		this.scene.events.off(GAME_EVENTS.TYPING_INPUT, this.handleTypingInput, this);
		super.destroy(fromScene);
	}
}
