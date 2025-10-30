import { describe, it, expect, vi, beforeEach } from 'vitest';
import Medkit from './medkit.js';

vi.mock('./item.js', () => ({
	default: class Item {
		constructor(scene, x, y, itemType, itemId, spriteKey) {
			this.scene = scene;
			this.x = x;
			this.y = y;
			this.itemType = itemType;
			this.itemId = itemId;
			this.spriteKey = spriteKey;
			this.baseValue = 25;
		}
		onKill() {}
	},
}));

describe('Medkit', () => {
	let mockScene;
	let medkit;

	beforeEach(() => {
		mockScene = {
			stateManager: {
				playerHeal: vi.fn(),
			},
		};

		medkit = new Medkit(mockScene, 100, 200, 'medkit1');
	});

	it('should initialize with correct properties', () => {
		expect(medkit.itemType).toBe('MEDKIT');
		expect(medkit.spriteKey).toBe('medkit');
		expect(medkit.x).toBe(100);
		expect(medkit.y).toBe(200);
		expect(medkit.itemId).toBe('medkit1');
	});

	it('should set heal amount from base value', () => {
		expect(medkit.healAmount).toBe(25);
	});

	it('should call playerHeal on kill', () => {
		medkit.onKill();

		expect(mockScene.stateManager.playerHeal).toHaveBeenCalledWith({
			amount: 25,
		});
	});
});
