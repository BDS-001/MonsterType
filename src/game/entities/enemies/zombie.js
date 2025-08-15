import Enemy from './enemy.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Zombie extends Enemy {
	constructor(scene, id) {
		const zombieOptions = {
			moveSpeed: 40,
			knockback: 40,
			wordCategory: 'easy',
		};

		super(id, scene, 'zombie', zombieOptions);
	}

	onKill() {
		super.onKill();
		console.log('Zombie.onKill called:', { id: this.id });

		const val = Math.floor(Math.random() * 100);
		console.log('Random value for item drop:', val);
		if (val < 5) {
			console.log('Emitting ITEM_SPAWNED event');
			this.scene.events.emit(GAME_EVENTS.ITEM_SPAWNED, {
				x: this.x,
				y: this.y,
				itemType: 'MEDKIT',
			});
		}
	}
}
