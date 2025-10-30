import { describe, it, expect, vi, beforeEach } from 'vitest';
import RandomWeaponDrop from './randomWeaponDrop.js';

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

vi.mock('../../core/GameEvents.js', () => ({
	GAME_EVENTS: {
		RANDOM_WEAPON_REQUESTED: 'RANDOM_WEAPON_REQUESTED',
	},
}));

describe('RandomWeaponDrop', () => {
	let mockScene;
	let randomWeaponDrop;

	beforeEach(() => {
		mockScene = {
			events: {
				emit: vi.fn(),
			},
		};

		randomWeaponDrop = new RandomWeaponDrop(mockScene, 100, 200, 'weapon1');
	});

	it('should initialize with correct properties', () => {
		expect(randomWeaponDrop.itemType).toBe('RANDOM_WEAPON_DROP');
		expect(randomWeaponDrop.spriteKey).toBe('randomWeapon');
		expect(randomWeaponDrop.x).toBe(100);
		expect(randomWeaponDrop.y).toBe(200);
	});

	it('should emit random weapon requested event on kill', () => {
		randomWeaponDrop.onKill();

		expect(mockScene.events.emit).toHaveBeenCalledWith('RANDOM_WEAPON_REQUESTED');
	});
});
