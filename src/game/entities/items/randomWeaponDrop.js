import Item from './item.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class RandomWeaponDrop extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'RANDOM_WEAPON_DROP', itemId, 'randomWeapon');
	}

	onKill() {
		this.scene.events.emit(GAME_EVENTS.RANDOM_WEAPON_REQUESTED);
	}
}
