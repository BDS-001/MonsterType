import { describe, it, expect, vi, beforeEach } from 'vitest';
import TargetManager from './TargetManager.js';
import mockPhaser from '../../test-utils/phaser.mock.js';
import { createMockScene } from '../../test-utils/scene.mock.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

mockPhaser();

vi.mock('../core/BaseManager.js', () => ({
	default: class BaseManager {
		constructor(scene) {
			this.scene = scene;
		}
		subscribe() {}
		emit() {}
		destroy() {}
	},
}));

describe('TargetManager', () => {
	let mockScene;
	let targetManager;

	beforeEach(() => {
		mockScene = createMockScene({
			player: {
				x: 400,
				y: 300,
			},
			enemyManager: null,
			itemManager: null,
		});

		targetManager = new TargetManager(mockScene);
		targetManager.emit = vi.fn();
	});

	describe('initialization', () => {
		it('should initialize and setup event listeners', () => {
			expect(targetManager.scene).toBe(mockScene);
			expect(targetManager.subscribe).toBeDefined();
		});
	});

	describe('findValidTargets', () => {
		it('should return empty array when no managers exist', () => {
			const validTargets = targetManager.findValidTargets('a');
			expect(validTargets).toEqual([]);
		});

		it('should find valid enemies matching the letter', () => {
			const enemy1 = {
				isDestroyed: false,
				word: 'apple',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => true),
			};
			const enemy2 = {
				isDestroyed: false,
				word: 'banana',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => true),
			};

			mockScene.enemyManager = {
				getEnemies: () => ({
					getChildren: () => [enemy1, enemy2],
				}),
			};

			const validTargets = targetManager.findValidTargets('a');
			expect(validTargets).toEqual([enemy1]);
		});

		it('should find valid items matching the letter', () => {
			const item1 = {
				isDestroyed: false,
				word: 'apple',
				hitIndex: 0,
			};
			const item2 = {
				isDestroyed: false,
				word: 'banana',
				hitIndex: 0,
			};

			mockScene.itemManager = {
				getItems: () => ({
					getChildren: () => [item1, item2],
				}),
			};

			const validTargets = targetManager.findValidTargets('a');
			expect(validTargets).toEqual([item1]);
		});

		it('should exclude destroyed enemies', () => {
			const enemy1 = {
				isDestroyed: true,
				word: 'apple',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => true),
			};

			mockScene.enemyManager = {
				getEnemies: () => ({
					getChildren: () => [enemy1],
				}),
			};

			const validTargets = targetManager.findValidTargets('a');
			expect(validTargets).toEqual([]);
		});

		it('should exclude enemies not on screen', () => {
			const enemy1 = {
				isDestroyed: false,
				word: 'apple',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => false),
			};

			mockScene.enemyManager = {
				getEnemies: () => ({
					getChildren: () => [enemy1],
				}),
			};

			const validTargets = targetManager.findValidTargets('a');
			expect(validTargets).toEqual([]);
		});

		it('should exclude destroyed items', () => {
			const item1 = {
				isDestroyed: true,
				word: 'apple',
				hitIndex: 0,
			};

			mockScene.itemManager = {
				getItems: () => ({
					getChildren: () => [item1],
				}),
			};

			const validTargets = targetManager.findValidTargets('a');
			expect(validTargets).toEqual([]);
		});

		it('should match letter at current hitIndex', () => {
			const enemy1 = {
				isDestroyed: false,
				word: 'apple',
				hitIndex: 2,
				isEnemyOnScreen: vi.fn(() => true),
			};

			mockScene.enemyManager = {
				getEnemies: () => ({
					getChildren: () => [enemy1],
				}),
			};

			const validTargets = targetManager.findValidTargets('p');
			expect(validTargets).toEqual([enemy1]);
		});

		it('should exclude targets when hitIndex exceeds word length', () => {
			const enemy1 = {
				isDestroyed: false,
				word: 'apple',
				hitIndex: 5,
				isEnemyOnScreen: vi.fn(() => true),
			};

			mockScene.enemyManager = {
				getEnemies: () => ({
					getChildren: () => [enemy1],
				}),
			};

			const validTargets = targetManager.findValidTargets('a');
			expect(validTargets).toEqual([]);
		});

		it('should combine enemies and items in results', () => {
			const enemy1 = {
				isDestroyed: false,
				word: 'apple',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => true),
			};
			const item1 = {
				isDestroyed: false,
				word: 'axe',
				hitIndex: 0,
			};

			mockScene.enemyManager = {
				getEnemies: () => ({
					getChildren: () => [enemy1],
				}),
			};
			mockScene.itemManager = {
				getItems: () => ({
					getChildren: () => [item1],
				}),
			};

			const validTargets = targetManager.findValidTargets('a');
			expect(validTargets).toEqual([enemy1, item1]);
		});
	});

	describe('sortTargetsByDistance', () => {
		it('should sort targets by distance from player', () => {
			const player = { x: 0, y: 0 };
			const target1 = { x: 100, y: 0 };
			const target2 = { x: 50, y: 0 };
			const target3 = { x: 75, y: 0 };

			const sorted = targetManager.sortTargetsByDistance([target1, target2, target3], player);

			expect(sorted[0]).toBe(target2);
			expect(sorted[1]).toBe(target3);
			expect(sorted[2]).toBe(target1);
		});

		it('should handle empty array', () => {
			const player = { x: 0, y: 0 };
			const sorted = targetManager.sortTargetsByDistance([], player);
			expect(sorted).toEqual([]);
		});

		it('should handle single target', () => {
			const player = { x: 0, y: 0 };
			const target1 = { x: 100, y: 0 };

			const sorted = targetManager.sortTargetsByDistance([target1], player);
			expect(sorted).toEqual([target1]);
		});
	});

	describe('handleWeaponReadyToFire', () => {
		it('should find, sort, and select targets', () => {
			const enemy1 = {
				isDestroyed: false,
				word: 'apple',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => true),
				x: 420,
				y: 300,
			};
			const enemy2 = {
				isDestroyed: false,
				word: 'axe',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => true),
				x: 450,
				y: 300,
			};

			mockScene.enemyManager = {
				getEnemies: () => ({
					getChildren: () => [enemy1, enemy2],
				}),
			};

			const weapon = {
				maxTargets: 2,
				fire: vi.fn(),
			};

			targetManager.handleWeaponReadyToFire({
				key: 'a',
				weapon,
			});

			expect(weapon.fire).toHaveBeenCalled();
			expect(targetManager.emit).toHaveBeenCalledWith(GAME_EVENTS.TARGETS_SELECTED, {
				targets: [enemy1, enemy2],
				weapon,
				key: 'a',
				originX: 400,
				originY: 300,
			});
		});

		it('should limit targets to weapon maxTargets', () => {
			const enemy1 = {
				isDestroyed: false,
				word: 'apple',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => true),
				x: 500,
				y: 300,
			};
			const enemy2 = {
				isDestroyed: false,
				word: 'axe',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => true),
				x: 350,
				y: 300,
			};
			const enemy3 = {
				isDestroyed: false,
				word: 'art',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => true),
				x: 425,
				y: 300,
			};

			mockScene.enemyManager = {
				getEnemies: () => ({
					getChildren: () => [enemy1, enemy2, enemy3],
				}),
			};

			const weapon = {
				maxTargets: 2,
				fire: vi.fn(),
			};

			targetManager.handleWeaponReadyToFire({
				key: 'a',
				weapon,
			});

			expect(weapon.fire).toHaveBeenCalled();
			const emitCall = targetManager.emit.mock.calls[0];
			expect(emitCall[1].targets.length).toBe(2);
			expect(emitCall[1].targets).toEqual([enemy3, enemy2]);
		});

		it('should not fire weapon when no valid targets', () => {
			mockScene.enemyManager = {
				getEnemies: () => ({
					getChildren: () => [],
				}),
			};

			const weapon = {
				maxTargets: 1,
				fire: vi.fn(),
			};

			targetManager.handleWeaponReadyToFire({
				key: 'a',
				weapon,
			});

			expect(weapon.fire).not.toHaveBeenCalled();
			expect(targetManager.emit).not.toHaveBeenCalled();
		});

		it('should use player position as origin', () => {
			mockScene.player = { x: 123, y: 456 };

			const enemy1 = {
				isDestroyed: false,
				word: 'apple',
				hitIndex: 0,
				isEnemyOnScreen: vi.fn(() => true),
				x: 100,
				y: 0,
			};

			mockScene.enemyManager = {
				getEnemies: () => ({
					getChildren: () => [enemy1],
				}),
			};

			const weapon = {
				maxTargets: 1,
				fire: vi.fn(),
			};

			targetManager.handleWeaponReadyToFire({
				key: 'a',
				weapon,
			});

			const emitCall = targetManager.emit.mock.calls[0];
			expect(emitCall[1].originX).toBe(123);
			expect(emitCall[1].originY).toBe(456);
		});
	});
});
