import TypedEntity from '../typedEntity';
import { ITEM_DATA } from '../../core/itemData.js';

export default class Item extends TypedEntity {
	constructor(scene, x, y, itemId) {
		const itemData = ITEM_DATA[itemId];
		if (!itemData) {
			throw new Error(`Item data not found for id: ${itemId}`);
		}

		super(scene, x, y, 'item-sprite', itemData.word);

		this.id = itemData.id;
		this.name = itemData.name;
		this.word = itemData.word;
		this.type = itemData.type;
		this.rarity = itemData.rarity;

		scene.add.existing(this);
		scene.physics.add.existing(this);
	}
}
