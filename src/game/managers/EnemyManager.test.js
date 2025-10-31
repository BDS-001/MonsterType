import { describe, it, expect, vi, beforeEach } from 'vitest';
import EnemyManager from './EnemyManager.js';

vi.mock('../entities/enemies/zombie', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/enemies/ghost', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/enemies/mummy', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/enemies/slime.js', () => ({
	default: vi.fn(),
}));

vi.mock('../core/BaseManager.js', () => ({
	default: class BaseManager {
		constructor(scene) {
			this.scene = scene;
		}
		emit() {}
		destroy() {}
		destroyGroup() {}
	},
}));

vi.mock('../core/GameEvents.js', () => ({
	GAME_EVENTS: {
		SPAWN_ENEMIES: 'SPAWN_ENEMIES',
		ENEMY_SPAWNED: 'ENEMY_SPAWNED',
	},
}));

describe('EnemyManager', () => {
	let mockScene;
	let enemyManager;
	let mockGroup;

	beforeEach(() => {
		mockGroup = {
			children: { entries: [] },
			add: vi.fn(),
			getChildren: vi.fn(() => []),
		};

		mockScene = {
			add: {
				group: vi.fn(() => mockGroup),
			},
			events: {
				on: vi.fn(),
				off: vi.fn(),
			},
			cameras: {
				main: {
					width: 800,
					height: 600,
				},
			},
			environmentalEffectsManager: {
				applyEffectsToEnemy: vi.fn(),
			},
		};

		enemyManager = new EnemyManager(mockScene);
	});

	it('should initialize with correct properties', () => {
		expect(enemyManager.enemies).toBe(mockGroup);
		expect(enemyManager.currentEnemyId).toBe(0);
	});

	it('should setup event listeners on initialization', () => {
		expect(mockScene.events.on).toHaveBeenCalledWith(
			'SPAWN_ENEMIES',
			expect.any(Function),
			enemyManager
		);
	});

	it('should create enemies group with correct config', () => {
		expect(mockScene.add.group).toHaveBeenCalledWith({
			runChildUpdate: false,
		});
	});

	describe('spawnEnemyType', () => {
		it('should spawn enemy at specified coordinates', () => {
			const mockEnemy = { isDestroyed: false };
			const EnemyClass = vi.fn(() => mockEnemy);

			enemyManager.spawnEnemyType(EnemyClass, 1, { x: 100, y: 200 });

			expect(EnemyClass).toHaveBeenCalledWith(
				mockScene,
				100,
				200,
				'enemy0',
				{ x: 100, y: 200 }
			);
			expect(mockGroup.add).toHaveBeenCalledWith(mockEnemy);
			expect(enemyManager.currentEnemyId).toBe(1);
		});

		it('should spawn enemy at edge position when no coordinates provided', () => {
			const mockEnemy = { isDestroyed: false };
			const EnemyClass = vi.fn(() => mockEnemy);

			vi.spyOn(Math, 'random').mockReturnValue(0.5);
			vi.spyOn(Math, 'floor').mockReturnValue(0);

			enemyManager.spawnEnemyType(EnemyClass, 1);

			expect(EnemyClass).toHaveBeenCalled();
			expect(mockGroup.add).toHaveBeenCalledWith(mockEnemy);
		});

		it('should spawn multiple enemies', () => {
			const mockEnemy1 = { isDestroyed: false };
			const mockEnemy2 = { isDestroyed: false };
			const EnemyClass = vi
				.fn()
				.mockReturnValueOnce(mockEnemy1)
				.mockReturnValueOnce(mockEnemy2);

			enemyManager.spawnEnemyType(EnemyClass, 2, { x: 100, y: 100 });

			expect(EnemyClass).toHaveBeenCalledTimes(2);
			expect(mockGroup.add).toHaveBeenCalledWith(mockEnemy1);
			expect(mockGroup.add).toHaveBeenCalledWith(mockEnemy2);
			expect(enemyManager.currentEnemyId).toBe(2);
		});

		it('should increment enemy ID for each spawn', () => {
			const EnemyClass = vi.fn(() => ({ isDestroyed: false }));

			enemyManager.spawnEnemyType(EnemyClass, 1, { x: 100, y: 100 });
			expect(enemyManager.currentEnemyId).toBe(1);

			enemyManager.spawnEnemyType(EnemyClass, 1, { x: 200, y: 200 });
			expect(enemyManager.currentEnemyId).toBe(2);
		});

		it('should apply environmental effects to spawned enemy', () => {
			const mockEnemy = { isDestroyed: false };
			const EnemyClass = vi.fn(() => mockEnemy);

			enemyManager.spawnEnemyType(EnemyClass, 1, { x: 100, y: 100 });

			expect(mockScene.environmentalEffectsManager.applyEffectsToEnemy).toHaveBeenCalledWith(
				mockEnemy
			);
		});
	});

	describe('calculateEdgePosition', () => {
		it('should spawn on top edge', () => {
			vi.spyOn(Math, 'floor').mockReturnValue(0);
			vi.spyOn(Math, 'random').mockReturnValue(0.5);

			const position = enemyManager.calculateEdgePosition();

			expect(position.x).toBe(400);
			expect(position.y).toBe(-100);
		});

		it('should spawn on right edge', () => {
			vi.spyOn(Math, 'floor').mockReturnValue(1);
			vi.spyOn(Math, 'random').mockReturnValue(0.5);

			const position = enemyManager.calculateEdgePosition();

			expect(position.x).toBe(900);
			expect(position.y).toBe(300);
		});

		it('should spawn on bottom edge', () => {
			vi.spyOn(Math, 'floor').mockReturnValue(2);
			vi.spyOn(Math, 'random').mockReturnValue(0.5);

			const position = enemyManager.calculateEdgePosition();

			expect(position.x).toBe(400);
			expect(position.y).toBe(700);
		});

		it('should spawn on left edge', () => {
			vi.spyOn(Math, 'floor').mockReturnValue(3);
			vi.spyOn(Math, 'random').mockReturnValue(0.5);

			const position = enemyManager.calculateEdgePosition();

			expect(position.x).toBe(-100);
			expect(position.y).toBe(300);
		});
	});

	describe('spawnEnemiesFromCounts', () => {
		it('should spawn zombies when count provided', () => {
			const spawnSpy = vi.spyOn(enemyManager, 'spawnEnemyType');

			enemyManager.spawnEnemiesFromCounts({
				zombie: { count: 3 },
			});

			expect(spawnSpy).toHaveBeenCalledWith(expect.any(Function), 3, {});
		});

		it('should spawn multiple enemy types', () => {
			const spawnSpy = vi.spyOn(enemyManager, 'spawnEnemyType');

			enemyManager.spawnEnemiesFromCounts({
				zombie: { count: 2 },
				ghost: { count: 3 },
				mummy: { count: 1 },
				slime: { count: 4 },
			});

			expect(spawnSpy).toHaveBeenCalledTimes(4);
		});

		it('should pass config to spawnEnemyType', () => {
			const spawnSpy = vi.spyOn(enemyManager, 'spawnEnemyType');
			const config = { speed: 200 };

			enemyManager.spawnEnemiesFromCounts({
				zombie: { count: 2, config },
			});

			expect(spawnSpy).toHaveBeenCalledWith(expect.any(Function), 2, config);
		});

		it('should not spawn enemies with zero count', () => {
			const spawnSpy = vi.spyOn(enemyManager, 'spawnEnemyType');

			enemyManager.spawnEnemiesFromCounts({
				zombie: { count: 0 },
			});

			expect(spawnSpy).not.toHaveBeenCalled();
		});

		it('should not spawn enemies when count is undefined', () => {
			const spawnSpy = vi.spyOn(enemyManager, 'spawnEnemyType');

			enemyManager.spawnEnemiesFromCounts({
				zombie: {},
			});

			expect(spawnSpy).not.toHaveBeenCalled();
		});
	});

	describe('getEnemies', () => {
		it('should return enemies group', () => {
			expect(enemyManager.getEnemies()).toBe(mockGroup);
		});
	});

	describe('getEnemyCount', () => {
		it('should return count of enemies', () => {
			mockGroup.getChildren.mockReturnValue([{}, {}, {}]);
			expect(enemyManager.getEnemyCount()).toBe(3);
		});

		it('should return zero when no enemies', () => {
			mockGroup.getChildren.mockReturnValue([]);
			expect(enemyManager.getEnemyCount()).toBe(0);
		});
	});

	describe('update', () => {
		it('should update all active enemies', () => {
			const enemy1 = { isDestroyed: false, update: vi.fn() };
			const enemy2 = { isDestroyed: false, update: vi.fn() };
			mockGroup.children.entries = [enemy1, enemy2];

			enemyManager.update(16);

			expect(enemy1.update).toHaveBeenCalledWith(16);
			expect(enemy2.update).toHaveBeenCalledWith(16);
		});

		it('should not update destroyed enemies', () => {
			const enemy1 = { isDestroyed: true, update: vi.fn() };
			const enemy2 = { isDestroyed: false, update: vi.fn() };
			mockGroup.children.entries = [enemy1, enemy2];

			enemyManager.update(16);

			expect(enemy1.update).not.toHaveBeenCalled();
			expect(enemy2.update).toHaveBeenCalledWith(16);
		});

		it('should handle empty enemies list', () => {
			mockGroup.children.entries = [];

			expect(() => enemyManager.update(16)).not.toThrow();
		});
	});

	describe('destroy', () => {
		it('should remove event listeners', () => {
			enemyManager.destroy();

			expect(mockScene.events.off).toHaveBeenCalledWith(
				'SPAWN_ENEMIES',
				expect.any(Function),
				enemyManager
			);
		});

		it('should set enemies to null', () => {
			enemyManager.destroy();

			expect(enemyManager.enemies).toBeNull();
		});
	});
});
