import Item from './item.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Multiplier extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'MULTIPLIER', itemId, 'item-sprite');
		this.multiplierValue = this.baseValue;
	}

	onKill() {
		this.scene.events.emit(GAME_EVENTS.MULTIPLIER_REQUESTED, {
			multiplier: this.multiplierValue,
		});
	}
}
