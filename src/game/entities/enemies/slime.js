import Enemy from './enemy.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

const difficultyMap = {
	0: { moveSpeed: 80, difficulty: 'veryEasy', scale: 1.5 },
	1: { moveSpeed: 60, difficulty: 'easy', scale: 2.5 },
	2: { moveSpeed: 40, difficulty: 'medium', scale: 3.5 },
};

export default class Slime extends Enemy {
	constructor(scene, x, y, id, config = { splitCount: 2 }) {
		const splitCount = config.splitCount ?? 2;
		const difficultyData = difficultyMap[splitCount] ?? difficultyMap[2];

		const slimeOptions = {
			moveSpeed: difficultyData.moveSpeed,
			knockback: 0,
			wordCategory: difficultyData.difficulty,
			scale: config.scale ?? difficultyData.scale,
			dropTable: [
				{ itemType: 'SHIELD', chance: 1 },
				{ itemType: 'BOMB', chance: 1 },
			],
		};

		super(scene, x, y, id, 'test', slimeOptions);
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
