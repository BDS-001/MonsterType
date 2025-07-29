import Item from './item.js';
import gameState from '../../core/gameState.js';

export default class Medkit extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'MEDKIT', itemId);
		this.healAmount = this.baseValue;
	}

	onKill() {
		gameState.playerHeal(this.healAmount);
	}
}
