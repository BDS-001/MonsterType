import Enemy from './enemy.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';
import enemyConfig from '../../data/enemyConfig.json';

export default class Slime extends Enemy {
	constructor(scene, x, y, id, config = { splitCount: 2 }) {
		const splitCount = config.splitCount ?? 2;
		const difficultyData =
			enemyConfig.slime.difficulties[splitCount] ?? enemyConfig.slime.difficulties[2];

		const slimeOptions = {
			moveSpeed: difficultyData.moveSpeed,
			knockback: enemyConfig.slime.knockback,
			wordCategory: difficultyData.difficulty,
			scale: config.scale ?? difficultyData.scale,
			dropTable: enemyConfig.slime.dropTable,
		};

		super(scene, x, y, id, 'slime', slimeOptions);
		this.splitCount = splitCount;
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

				this.scene.events.emit(GAME_EVENTS.SPAWN_ENEMIES, {
					slime: {
						count: 1,
						config: {
							splitCount: this.splitCount - 1,
							x: spawnX,
							y: spawnY,
						},
					},
				});
			}
		}
	}
}
