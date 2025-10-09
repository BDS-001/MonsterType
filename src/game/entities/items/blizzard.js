import Item from './item.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Blizzard extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'BLIZZARD', itemId, 'item-sprite');
	}

	onKill() {
		this.scene.events.emit(GAME_EVENTS.ENVIRONMENTAL_EFFECT_ACTIVATE, {
			effectType: 'blizzard',
			duration: this.config.duration,
			config: {
				duration: this.config.duration,
				speedMultiplier: this.config.speedMultiplier,
				onEnemySpawn: (enemy) => {
					enemy.applyStatusEffect('freeze', {
						duration: this.config.duration,
						speedMultiplier: this.config.speedMultiplier,
					});
				},
			},
		});
	}
}
