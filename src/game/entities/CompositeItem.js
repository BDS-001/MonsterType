import TypedEntity from './typedEntity.js';
import items from '../data/items.json';
import { runAction } from '../composition/actions.js';
import { gameSettings } from '../core/constants.js';

export default class CompositeItem extends TypedEntity {
	constructor(scene, x, y, itemType, id) {
		const def = items[itemType];
		if (!def) throw new Error(`Item def not found: ${itemType}`);
		const texture = def.spriteKey || 'randomWeapon';
		super(scene, x, y, texture, def.word, id);
		this.entityType = 'item';
		this.itemType = itemType;
		this.setScale(gameSettings.ITEM_SPRITE_SCALE);

		this.config = def;

		this.floatTween = this.scene.tweens.add({
			targets: this,
			y: y - 10,
			duration: 1500,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
	}

	update(time, delta) {
		if (this.isDestroyed) return;
		super.update(time, delta);
	}

	onKill() {
		const actions = this.config?.triggers?.OnKill ?? [];
		for (const action of actions) runAction(action, this, this.scene);
	}

	destroy(fromScene) {
		this.floatTween?.destroy();
		super.destroy(fromScene);
	}
}
