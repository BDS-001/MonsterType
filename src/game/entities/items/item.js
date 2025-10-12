import TypedEntity from '../typedEntity';
import ITEM_DATA from '../../data/items.json';
import { gameSettings } from '../../core/constants';

export default class Item extends TypedEntity {
	constructor(scene, x, y, itemType, itemId, spriteKey = 'item-sprite') {
		const itemData = ITEM_DATA[itemType];
		if (!itemData) {
			throw new Error(`Item data not found for type: ${itemType}`);
		}

		super(scene, x, y, spriteKey, itemData.word, itemId);

		this.setScale(gameSettings.ITEM_SPRITE_SCALE);

		this.entityType = 'item';
		this.itemType = itemType;
		this.name = itemData.name;
		this.type = itemData.type;
		this.rarity = itemData.rarity;
		this.baseValue = itemData.baseValue || null;
		this.config = itemData;

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.floatTween = this.scene.tweens.add({
			targets: this,
			y: y - 10,
			duration: 1500,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
	}

	update() {
		if (this.isDestroyed) return;
		this.updateTextPositions();
	}

	onKill() {}

	destroy(fromScene) {
		if (this.floatTween) {
			this.floatTween.destroy();
		}
		super.destroy(fromScene);
	}
}
