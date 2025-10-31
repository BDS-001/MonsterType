import { describe, it, expect, vi, beforeEach } from 'vitest';
import Slime from './slime.js';
import enemyConfig from '../../data/enemyConfig.json';

vi.mock('./enemy.js', () => ({
	default: class Enemy {
		constructor(scene, x, y, id, spriteImage, options) {
			this.scene = scene;
			this.x = x;
			this.y = y;
			this.id = id;
			this.spriteImage = spriteImage;
			this.options = options;
		}
		onKill() {}
	},
}));

vi.mock('../../core/GameEvents.js', () => ({
	GAME_EVENTS: {
		SPAWN_ENEMIES: 'SPAWN_ENEMIES',
	},
}));

describe('Slime', () => {
	let mockScene;
	let slime;

	beforeEach(() => {
		mockScene = {
			player: { x: 100, y: 100 },
			events: {
				emit: vi.fn(),
			},
			time: {
				now: 0,
			},
		};
	});

	describe('initialization with default config', () => {
		beforeEach(() => {
			slime = new Slime(mockScene, 150, 150, 'slime1');
		});

		it('should initialize with correct position', () => {
			expect(slime.x).toBe(150);
			expect(slime.y).toBe(150);
		});

		it('should initialize with correct id', () => {
			expect(slime.id).toBe('slime1');
		});

		it('should use slime sprite', () => {
			expect(slime.spriteImage).toBe('slime');
		});

		it('should default to splitCount 2', () => {
			expect(slime.splitCount).toBe(2);
		});

		it('should have correct move speed for splitCount 2', () => {
			expect(slime.options.moveSpeed).toBe(enemyConfig.slime.difficulties['2'].moveSpeed);
		});

		it('should have correct knockback', () => {
			expect(slime.options.knockback).toBe(enemyConfig.slime.knockback);
		});

		it('should use correct word category for splitCount 2', () => {
			expect(slime.options.wordCategory).toBe(enemyConfig.slime.difficulties['2'].difficulty);
		});

		it('should have correct scale for splitCount 2', () => {
			expect(slime.options.scale).toBe(enemyConfig.slime.difficulties['2'].scale);
		});

		it('should have correct drop table', () => {
			expect(slime.options.dropTable).toEqual(enemyConfig.slime.dropTable);
		});
	});

	describe('initialization with splitCount 0', () => {
		beforeEach(() => {
			slime = new Slime(mockScene, 150, 150, 'slime1', { splitCount: 0 });
		});

		it('should have correct move speed for splitCount 0', () => {
			expect(slime.options.moveSpeed).toBe(enemyConfig.slime.difficulties['0'].moveSpeed);
		});

		it('should use correct word category for splitCount 0', () => {
			expect(slime.options.wordCategory).toBe(enemyConfig.slime.difficulties['0'].difficulty);
		});

		it('should have correct scale for splitCount 0', () => {
			expect(slime.options.scale).toBe(enemyConfig.slime.difficulties['0'].scale);
		});

		it('should set splitCount to 0', () => {
			expect(slime.splitCount).toBe(0);
		});
	});

	describe('initialization with splitCount 1', () => {
		beforeEach(() => {
			slime = new Slime(mockScene, 150, 150, 'slime1', { splitCount: 1 });
		});

		it('should have correct move speed for splitCount 1', () => {
			expect(slime.options.moveSpeed).toBe(enemyConfig.slime.difficulties['1'].moveSpeed);
		});

		it('should use correct word category for splitCount 1', () => {
			expect(slime.options.wordCategory).toBe(enemyConfig.slime.difficulties['1'].difficulty);
		});

		it('should have correct scale for splitCount 1', () => {
			expect(slime.options.scale).toBe(enemyConfig.slime.difficulties['1'].scale);
		});

		it('should set splitCount to 1', () => {
			expect(slime.splitCount).toBe(1);
		});
	});

	describe('initialization with custom scale', () => {
		it('should use custom scale when provided', () => {
			slime = new Slime(mockScene, 150, 150, 'slime1', { splitCount: 2, scale: 5 });
			expect(slime.options.scale).toBe(5);
		});
	});

	describe('onKill', () => {
		it('should spawn 2 smaller slimes when splitCount > 0', () => {
			slime = new Slime(mockScene, 200, 200, 'slime1', { splitCount: 2 });

			slime.onKill();

			expect(mockScene.events.emit).toHaveBeenCalledTimes(2);

			const firstCall = mockScene.events.emit.mock.calls[0][1];
			const secondCall = mockScene.events.emit.mock.calls[1][1];

			expect(firstCall.slime.count).toBe(1);
			expect(firstCall.slime.config.splitCount).toBe(1);
			expect(firstCall.slime.config.x).toBeDefined();
			expect(firstCall.slime.config.y).toBeDefined();

			expect(secondCall.slime.count).toBe(1);
			expect(secondCall.slime.config.splitCount).toBe(1);
			expect(secondCall.slime.config.x).toBeDefined();
			expect(secondCall.slime.config.y).toBeDefined();
		});

		it('should not spawn slimes when splitCount is 0', () => {
			slime = new Slime(mockScene, 200, 200, 'slime1', { splitCount: 0 });

			slime.onKill();

			expect(mockScene.events.emit).not.toHaveBeenCalled();
		});

		it('should decrement splitCount for spawned slimes', () => {
			slime = new Slime(mockScene, 200, 200, 'slime1', { splitCount: 1 });

			slime.onKill();

			expect(mockScene.events.emit).toHaveBeenCalledWith('SPAWN_ENEMIES', {
				slime: {
					count: 1,
					config: {
						splitCount: 0,
						x: expect.any(Number),
						y: expect.any(Number),
					},
				},
			});
		});

		it('should spawn slimes at calculated positions around parent', () => {
			slime = new Slime(mockScene, 100, 100, 'slime1', { splitCount: 2 });

			slime.onKill();

			const calls = mockScene.events.emit.mock.calls;
			const firstSpawn = calls[0][1].slime.config;
			const secondSpawn = calls[1][1].slime.config;

			expect(firstSpawn.x).toBeGreaterThanOrEqual(50);
			expect(firstSpawn.x).toBeLessThanOrEqual(150);
			expect(secondSpawn.x).toBeGreaterThanOrEqual(50);
			expect(secondSpawn.x).toBeLessThanOrEqual(150);
		});
	});
});
