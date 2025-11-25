import { describe, it, expect, vi, beforeEach } from 'vitest';
import Thunderstorm from './thunderstorm.js';
import { createMockScene } from '../../../test-utils/scene.mock.js';

global.Phaser = {
	Math: {
		Between: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
	},
	Utils: {
		Array: {
			GetRandom: (array) => array[0],
		},
	},
};

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
		mockScene = createMockScene();
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

	it('should include config with timer', () => {
		thunderstorm.onKill();

		const emitCall = mockScene.events.emit.mock.calls[0];
		const config = emitCall[1].config;

		expect(config.duration).toBe(8000);
		expect(config.timer).toBeDefined();
	});

	it('should create lightning timer', () => {
		thunderstorm.onKill();

		expect(mockScene.time.addEvent).toHaveBeenCalled();
		const timerConfig = mockScene.time.addEvent.mock.calls[0][0];
		expect(timerConfig.callback).toBeDefined();
		expect(timerConfig.loop).toBe(false);
	});
});
