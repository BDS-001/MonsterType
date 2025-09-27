import Enemy from './enemy.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Slime extends Enemy {
	constructor(scene, id, config = {}) {
		const slimeOptions = {
			moveSpeed: 100,
			knockback: 0,
			wordCategory: 'veryEasy',
			dropTable: [
				{ itemType: 'SHIELD', chance: 1 },
				{ itemType: 'BOMB', chance: 1 },
			],
		};

		super(id, scene, 'slime', slimeOptions);
		this.splitCount = config.splitCount ?? 2;
	}

	onKill() {
		super.onKill();

		if (this.splitCount > 0) {
			const numSplits = 2;
			for (let i = 0; i < numSplits; i++) {
				const angle = (Math.PI * 2 * i) / numSplits;
				const distance = 50;
				const spawnX = this.x + Math.cos(angle) * distance;
				const spawnY = this.y + Math.sin(angle) * distance;

				//TODO: handle this event
				this.scene.events.emit(GAME_EVENTS.SPAWN_ENEMY, {
					enemyType: 'slime',
					x: spawnX,
					y: spawnY,
					config: {
						splitCount: this.splitCount - 1,
					},
				});
			}
		}
	}
}
