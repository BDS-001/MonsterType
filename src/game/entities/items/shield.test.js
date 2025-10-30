import { describe, it, expect, vi, beforeEach } from 'vitest';
import Shield from './shield.js';

vi.mock('./item.js', () => ({
	default: class Item {
		constructor(scene, x, y, itemType, itemId, spriteKey) {
			this.scene = scene;
			this.x = x;
			this.y = y;
			this.itemType = itemType;
			this.itemId = itemId;
			this.spriteKey = spriteKey;
			this.baseValue = 50;
		}
		onKill() {}
	},
}));

describe('Shield', () => {
	let mockScene;
	let shield;
	let mockPlayer;

	beforeEach(() => {
		mockPlayer = {
			applyShield: vi.fn(),
		};

		mockScene = {
			player: mockPlayer,
		};

		shield = new Shield(mockScene, 100, 200, 'shield1');
	});

	it('should initialize with correct properties', () => {
		expect(shield.itemType).toBe('SHIELD');
		expect(shield.spriteKey).toBe('shield');
		expect(shield.shieldAmount).toBe(50);
	});

	it('should apply shield to player on kill', () => {
		shield.onKill();

		expect(mockPlayer.applyShield).toHaveBeenCalledWith(50);
	});

	it('should throw error if player not initialized', () => {
		mockScene.player = null;

		expect(() => shield.onKill()).toThrow('Player not initialized');
	});
});
