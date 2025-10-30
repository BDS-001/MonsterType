import { describe, it, expect, vi, beforeEach } from 'vitest';
import Blizzard from './blizzard.js';

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
				duration: 5000,
				speedMultiplier: 0.5,
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

describe('Blizzard', () => {
	let mockScene;
	let blizzard;

	beforeEach(() => {
		mockScene = {
			events: {
				emit: vi.fn(),
			},
		};

		blizzard = new Blizzard(mockScene, 100, 200, 'blizzard1');
	});

	it('should initialize with correct properties', () => {
		expect(blizzard.itemType).toBe('BLIZZARD');
		expect(blizzard.spriteKey).toBe('item-sprite');
	});

	it('should emit environmental effect event on kill', () => {
		blizzard.onKill();

		expect(mockScene.events.emit).toHaveBeenCalledWith(
			'ENVIRONMENTAL_EFFECT_ACTIVATE',
			expect.objectContaining({
				effectType: 'blizzard',
				duration: 5000,
			})
		);
	});

	it('should include config with onEnemySpawn callback', () => {
		blizzard.onKill();

		const emitCall = mockScene.events.emit.mock.calls[0];
		const config = emitCall[1].config;

		expect(config.duration).toBe(5000);
		expect(config.speedMultiplier).toBe(0.5);
		expect(typeof config.onEnemySpawn).toBe('function');
	});

	it('should apply freeze effect to enemies on spawn', () => {
		blizzard.onKill();

		const emitCall = mockScene.events.emit.mock.calls[0];
		const onEnemySpawn = emitCall[1].config.onEnemySpawn;

		const mockEnemy = {
			applyStatusEffect: vi.fn(),
		};

		onEnemySpawn(mockEnemy);

		expect(mockEnemy.applyStatusEffect).toHaveBeenCalledWith('freeze', {
			duration: 5000,
			speedMultiplier: 0.5,
		});
	});
});
