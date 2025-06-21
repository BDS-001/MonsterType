import Phaser from 'phaser';
import { ITEM_DATA } from '../../core/itemData.js';

export default class Item extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'item-sprite');

		const itemData = ITEM_DATA[itemId];
		if (!itemData) {
			throw new Error(`Item data not found for id: ${itemId}`);
		}

		this.id = itemData.id;
		this.name = itemData.name;
		this.word = itemData.word;
		this.type = itemData.type;
		this.rarity = itemData.rarity;

		scene.add.existing(this);
		scene.physics.add.existing(this);
	}
}
