import Item from './item.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Medkit extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'MEDKIT', itemId);
		this.healAmount = this.baseValue;
	}

	onKill() {
		this.scene.events.emit(GAME_EVENTS.PLAYER_HEALED, { amount: this.healAmount });
	}
}
