import { describe, it, expect, vi, beforeEach } from 'vitest';
import HolyWater from './holyWater.js';
import { createMockScene } from '../../../test-utils/scene.mock.js';

vi.mock('./item.js', () => ({
	default: class Item {
		constructor(scene, x, y, itemType, itemId, spriteKey) {
			this.scene = scene;
			this.x = x;
			this.y = y;
			this.itemType = itemType;
			this.itemId = itemId;
			this.spriteKey = spriteKey;
		}
		onKill() {}
	},
}));

describe('HolyWater', () => {
	let mockScene;
	let holyWater;
	let mockPlayer;

	beforeEach(() => {
		mockPlayer = {
			health: 50,
			maxHealth: 100,
			applyShield: vi.fn(),
		};

		mockScene = createMockScene({
			player: mockPlayer,
			stateManager: {
				playerHeal: vi.fn(),
			},
		});

		holyWater = new HolyWater(mockScene, 100, 200, 'holyWater1');
	});

	it('should initialize with correct properties', () => {
		expect(holyWater.itemType).toBe('HOLY_WATER');
		expect(holyWater.spriteKey).toBe('medkit');
		expect(holyWater.x).toBe(100);
		expect(holyWater.y).toBe(200);
		expect(holyWater.itemId).toBe('holyWater1');
		expect(holyWater.shieldAmount).toBe(5);
	});

	it('should heal player to max health and apply shield on kill', () => {
		holyWater.onKill();

		expect(mockScene.stateManager.playerHeal).toHaveBeenCalledWith({
			amount: 50,
		});
		expect(mockPlayer.applyShield).toHaveBeenCalledWith(5);
	});

	it('should only apply shield when player is at max health', () => {
		mockPlayer.health = 100;
		mockPlayer.maxHealth = 100;

		holyWater.onKill();

		expect(mockScene.stateManager.playerHeal).not.toHaveBeenCalled();
		expect(mockPlayer.applyShield).toHaveBeenCalledWith(5);
	});

	it('should handle partial healing', () => {
		mockPlayer.health = 90;
		mockPlayer.maxHealth = 100;

		holyWater.onKill();

		expect(mockScene.stateManager.playerHeal).toHaveBeenCalledWith({
			amount: 10,
		});
		expect(mockPlayer.applyShield).toHaveBeenCalledWith(5);
	});

	it('should not heal if player is not initialized', () => {
		mockScene.player = null;

		holyWater.onKill();

		expect(mockScene.stateManager.playerHeal).not.toHaveBeenCalled();
	});

	it('should not apply shield if player is not initialized', () => {
		mockScene.player = null;

		holyWater.onKill();

		expect(mockPlayer.applyShield).not.toHaveBeenCalled();
	});
});
