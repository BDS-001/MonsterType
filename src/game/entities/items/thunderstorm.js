import Item from './item.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Thunderstorm extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'THUNDERSTORM', itemId, 'item-sprite');
	}

	onKill() {
		this.scene.events.emit(GAME_EVENTS.ENVIRONMENTAL_EFFECT_ACTIVATE, {
			effectType: 'thunderstorm',
			duration: this.config.duration,
			config: {
				duration: this.config.duration,
				onEnemySpawn: (enemy) => {
					// TODO: Implement random lightning strikes on enemies
				},
			},
		});
	}
}
