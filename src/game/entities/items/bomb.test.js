import { describe, it, expect, vi, beforeEach } from 'vitest';
import Bomb from './bomb.js';

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
			this.config = { radius: 100 };
		}
		onKill() {}
	},
}));

describe('Bomb', () => {
	let mockScene;
	let bomb;
	let mockGraphics;

	beforeEach(() => {
		mockGraphics = {
			setPosition: vi.fn().mockReturnThis(),
			lineStyle: vi.fn().mockReturnThis(),
			fillStyle: vi.fn().mockReturnThis(),
			fillCircle: vi.fn().mockReturnThis(),
			strokeCircle: vi.fn().mockReturnThis(),
			destroy: vi.fn(),
		};

		mockScene = {
			add: {
				graphics: vi.fn(() => mockGraphics),
			},
			tweens: {
				add: vi.fn(),
			},
			physics: {
				overlapCirc: vi.fn(() => []),
			},
		};

		bomb = new Bomb(mockScene, 100, 200, 'bomb1');
	});

	it('should initialize with correct properties', () => {
		expect(bomb.itemType).toBe('BOMB');
		expect(bomb.spriteKey).toBe('bomb');
		expect(bomb.damage).toBe(50);
		expect(bomb.radius).toBe(100);
	});

	it('should have valid targets', () => {
		expect(bomb.validTargets).toEqual(['item', 'enemy']);
	});

	it('should create blast effect on kill', () => {
		bomb.onKill();

		expect(mockScene.add.graphics).toHaveBeenCalled();
		expect(mockGraphics.setPosition).toHaveBeenCalledWith(100, 200);
		expect(mockGraphics.fillCircle).toHaveBeenCalledWith(0, 0, 100);
		expect(mockGraphics.strokeCircle).toHaveBeenCalledWith(0, 0, 100);
		expect(mockScene.tweens.add).toHaveBeenCalled();
	});

	it('should damage targets in radius', () => {
		const mockEnemy1 = {
			gameObject: {
				entityType: 'enemy',
				takeDamage: vi.fn(),
			},
		};
		const mockEnemy2 = {
			gameObject: {
				entityType: 'enemy',
				takeDamage: vi.fn(),
			},
		};

		mockScene.physics.overlapCirc.mockReturnValue([mockEnemy1, mockEnemy2]);

		bomb.onKill();

		expect(mockScene.physics.overlapCirc).toHaveBeenCalledWith(100, 200, 100, true, false);
		expect(mockEnemy1.gameObject.takeDamage).toHaveBeenCalledWith(50);
		expect(mockEnemy2.gameObject.takeDamage).toHaveBeenCalledWith(50);
	});

	it('should only damage valid targets', () => {
		const mockEnemy = {
			gameObject: {
				entityType: 'enemy',
				takeDamage: vi.fn(),
			},
		};
		const mockPlayer = {
			gameObject: {
				entityType: 'player',
				takeDamage: vi.fn(),
			},
		};

		mockScene.physics.overlapCirc.mockReturnValue([mockEnemy, mockPlayer]);

		bomb.onKill();

		expect(mockEnemy.gameObject.takeDamage).toHaveBeenCalled();
		expect(mockPlayer.gameObject.takeDamage).not.toHaveBeenCalled();
	});
});
