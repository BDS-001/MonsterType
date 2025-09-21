import Item from './item.js';

export default class Shield extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'SHIELD', itemId, 'shield');
		this.shieldAmount = this.baseValue;
	}

	onKill() {
		this.scene.stateManager.applyShield({
			amount: this.shieldAmount,
		});
	}
}
