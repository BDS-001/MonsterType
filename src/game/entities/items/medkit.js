import Item from './item.js';

export default class Medkit extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'MEDKIT', itemId);
		this.healAmount = this.baseValue;
	}

	onKill() {
		this.scene.stateManager.playerHeal({ amount: this.healAmount });
	}
}
