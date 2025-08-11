import Enemy from './enemy.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Zombie extends Enemy {
	constructor(scene, id) {
		const zombieOptions = {
			moveSpeed: 40,
			knockback: 80,
			wordCategory: 'easy',
		};

		super(id, scene, 'zombie', zombieOptions);
	}

	onKill() {
		const val = Math.floor(Math.random() * 100);
		console.log(val);
		if (val < 5) {
			this.scene.events.emit(GAME_EVENTS.ITEM_SPAWNED, {
				x: this.x,
				y: this.y,
				itemType: 'MEDKIT',
			});
		}
	}
}
