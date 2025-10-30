import { describe, it, expect, vi, beforeEach } from 'vitest';
import Thunderstorm from './thunderstorm.js';

vi.mock('./item.js', () => ({
	default: class Item {
		constructor(scene, x, y, itemType, itemId, spriteKey) {
			this.scene = scene;
			this.x = x;
			this.y = y;
			this.itemType = itemType;
			this.itemId = itemId;
			this.spriteKey = spriteKey;
			this.config = {
				duration: 8000,
			};
		}
		onKill() {}
	},
}));

vi.mock('../../core/GameEvents.js', () => ({
	GAME_EVENTS: {
		ENVIRONMENTAL_EFFECT_ACTIVATE: 'ENVIRONMENTAL_EFFECT_ACTIVATE',
	},
}));

describe('Thunderstorm', () => {
	let mockScene;
	let thunderstorm;

	beforeEach(() => {
		mockScene = {
			events: {
				emit: vi.fn(),
			},
		};

		thunderstorm = new Thunderstorm(mockScene, 100, 200, 'thunderstorm1');
	});

	it('should initialize with correct properties', () => {
		expect(thunderstorm.itemType).toBe('THUNDERSTORM');
		expect(thunderstorm.spriteKey).toBe('item-sprite');
	});

	it('should emit environmental effect event on kill', () => {
		thunderstorm.onKill();

		expect(mockScene.events.emit).toHaveBeenCalledWith(
			'ENVIRONMENTAL_EFFECT_ACTIVATE',
			expect.objectContaining({
				effectType: 'thunderstorm',
				duration: 8000,
			})
		);
	});

	it('should include config with onEnemySpawn callback', () => {
		thunderstorm.onKill();

		const emitCall = mockScene.events.emit.mock.calls[0];
		const config = emitCall[1].config;

		expect(config.duration).toBe(8000);
		expect(typeof config.onEnemySpawn).toBe('function');
	});
});
