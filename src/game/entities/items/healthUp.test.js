import { describe, it, expect, vi, beforeEach } from 'vitest';
import HealthUp from './healthUp.js';

vi.mock('./item.js', () => ({
	default: class Item {
		constructor(scene, x, y, itemType, itemId, spriteKey) {
			this.scene = scene;
			this.x = x;
			this.y = y;
			this.itemType = itemType;
			this.itemId = itemId;
			this.spriteKey = spriteKey;
			this.baseValue = 10;
		}
		onKill() {}
	},
}));

describe('HealthUp', () => {
	let mockScene;
	let healthUp;
	let mockPlayer;

	beforeEach(() => {
		mockPlayer = {
			increaseMaxHealth: vi.fn(),
		};

		mockScene = {
			player: mockPlayer,
		};

		healthUp = new HealthUp(mockScene, 100, 200, 'healthUp1');
	});

	it('should initialize with correct properties', () => {
		expect(healthUp.itemType).toBe('HEALTH_UP');
		expect(healthUp.spriteKey).toBe('healthUp');
		expect(healthUp.healthIncreaseValue).toBe(10);
	});

	it('should increase player max health on kill', () => {
		healthUp.onKill();

		expect(mockPlayer.increaseMaxHealth).toHaveBeenCalledWith(10, 10);
	});

	it('should throw error if player not initialized', () => {
		mockScene.player = null;

		expect(() => healthUp.onKill()).toThrow('Player not initialized');
	});
});
