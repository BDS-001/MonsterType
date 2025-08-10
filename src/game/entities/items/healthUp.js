import Item from './item.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class HealthUp extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'HEALTH_UP', itemId);
		this.healthIncreaseValue = this.baseValue;
	}

	onKill() {
		this.scene.events.emit(GAME_EVENTS.HEALTH_CHANGED, {
			maxHealthIncrease: this.healthIncreaseValue,
			healthIncrease: this.healthIncreaseValue,
		});
	}
}
