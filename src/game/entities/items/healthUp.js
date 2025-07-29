import Item from './item.js';
import gameState from '../../core/gameState.js';

export default class HealthUp extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'HEALTH_UP', itemId);
		this.healthIncreaseValue = this.baseValue;
	}

	onKill() {
		gameState.increaseHealth(this.healthIncreaseValue);
	}
}
