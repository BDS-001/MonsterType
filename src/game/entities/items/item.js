import TypedEntity from '../typedEntity';
import { ITEM_DATA } from '../../core/itemData.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Item extends TypedEntity {
	constructor(scene, x, y, itemType, itemId, spriteKey = 'item-sprite') {
		const itemData = ITEM_DATA[itemType];
		if (!itemData) {
			throw new Error(`Item data not found for type: ${itemType}`);
		}

		super(scene, x, y, spriteKey, itemData.word, itemId);

		this.setScale(2);

		this.entityType = 'item';
		this.itemType = itemType;
		this.name = itemData.name;
		this.type = itemData.type;
		this.rarity = itemData.rarity;
		this.baseValue = itemData.baseValue || null;
		this.config = itemData;

		scene.add.existing(this);
		scene.physics.add.existing(this);

		// floating animation
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

	onKill() {
		this.scene.events.emit(GAME_EVENTS.ITEM_DESTROYED, { item: this });
	}

	destroy(fromScene) {
		if (this.floatTween) {
			this.floatTween.destroy();
		}
		super.destroy(fromScene);
	}
}
