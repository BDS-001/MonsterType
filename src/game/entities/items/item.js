import TypedEntity from '../typedEntity';
import { ITEM_DATA } from '../../core/itemData.js';

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
}
