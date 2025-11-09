import { describe, it, expect, vi, beforeEach } from 'vitest';
import CollisionManager from './CollisionManager';
import { createMockScene } from '../../test-utils/scene.mock';
import { mockBaseManager } from '../../test-utils/basemanager.mock';
import { GAME_EVENTS } from '../core/GameEvents';

mockBaseManager();

describe('CollisionManager', () => {
	let collisionManager;
	let scene;
	let mockPlayer;
	let mockEnemyGroup;
	let mockEnemy;

	beforeEach(() => {
		mockPlayer = {
			x: 100,
			y: 100,
		};

		mockEnemy = {
			isDying: false,
			isDestroyed: false,
			knockbackEnemy: vi.fn(),
		};

		mockEnemyGroup = {
			children: {
				entries: [mockEnemy],
			},
		};

		const mockOverlap = vi.fn();
		const mockCollider = vi.fn();

		scene = createMockScene({
			player: mockPlayer,
			physics: {
				add: {
					overlap: mockOverlap,
					collider: mockCollider,
					existing: vi.fn(),
				},
				moveToObject: vi.fn(),
			},
			enemyManager: {
				getEnemies: vi.fn(() => mockEnemyGroup),
			},
		});

		collisionManager = new CollisionManager(scene);
	});

	it('should initialize with correct properties', () => {
		expect(collisionManager.scene).toBe(scene);
	});

	it('should setup collisions on initialization', () => {
		expect(scene.physics.add.overlap).toHaveBeenCalledWith(
			mockPlayer,
			mockEnemyGroup,
			collisionManager.handlePlayerEnemyCollision,
			null,
			collisionManager
		);
		expect(scene.physics.add.collider).toHaveBeenCalledWith(
			mockEnemyGroup,
			mockEnemyGroup,
			collisionManager.handleEnemyEnemyCollision,
			null,
			collisionManager
		);
	});

	describe('handlePlayerEnemyCollision', () => {
		it('should emit PLAYER_HIT event and knockback enemy', () => {
			collisionManager.handlePlayerEnemyCollision(mockPlayer, mockEnemy);

			expect(scene.events.emit).toHaveBeenCalledWith(GAME_EVENTS.PLAYER_HIT, {
				player: mockPlayer,
				enemy: mockEnemy,
			});
			expect(mockEnemy.knockbackEnemy).toHaveBeenCalled();
		});

		it('should not process collision if enemy is dying', () => {
			mockEnemy.isDying = true;

			collisionManager.handlePlayerEnemyCollision(mockPlayer, mockEnemy);

			expect(scene.events.emit).not.toHaveBeenCalled();
			expect(mockEnemy.knockbackEnemy).not.toHaveBeenCalled();
		});

		it('should not process collision if enemy is destroyed', () => {
			mockEnemy.isDestroyed = true;

			collisionManager.handlePlayerEnemyCollision(mockPlayer, mockEnemy);

			expect(scene.events.emit).not.toHaveBeenCalled();
			expect(mockEnemy.knockbackEnemy).not.toHaveBeenCalled();
		});
	});

	describe('handleEnemyEnemyCollision', () => {
		let enemyA;
		let enemyB;

		beforeEach(() => {
			enemyA = {
				isDying: false,
				isDestroyed: false,
			};
			enemyB = {
				isDying: false,
				isDestroyed: false,
			};
		});

		it('should return early if enemyA is destroyed', () => {
			enemyA.isDestroyed = true;

			const result = collisionManager.handleEnemyEnemyCollision(enemyA, enemyB);

			expect(result).toBeUndefined();
		});

		it('should return early if enemyB is destroyed', () => {
			enemyB.isDestroyed = true;

			const result = collisionManager.handleEnemyEnemyCollision(enemyA, enemyB);

			expect(result).toBeUndefined();
		});

		it('should return early if enemyA is dying', () => {
			enemyA.isDying = true;

			const result = collisionManager.handleEnemyEnemyCollision(enemyA, enemyB);

			expect(result).toBeUndefined();
		});

		it('should return early if enemyB is dying', () => {
			enemyB.isDying = true;

			const result = collisionManager.handleEnemyEnemyCollision(enemyA, enemyB);

			expect(result).toBeUndefined();
		});

		it('should allow collision processing for valid enemies', () => {
			const result = collisionManager.handleEnemyEnemyCollision(enemyA, enemyB);

			expect(result).toBeUndefined();
		});
	});

	describe('addCollision', () => {
		it('should add overlap with callback bound to collision manager', () => {
			const objectA = { x: 0 };
			const objectB = { x: 10 };
			const callback = vi.fn();

			collisionManager.addCollision(objectA, objectB, callback);

			expect(scene.physics.add.overlap).toHaveBeenCalledWith(
				objectA,
				objectB,
				expect.any(Function),
				null,
				scene
			);
		});

		it('should add overlap with custom process callback', () => {
			const objectA = { x: 0 };
			const objectB = { x: 10 };
			const callback = vi.fn();
			const processCallback = vi.fn();

			collisionManager.addCollision(objectA, objectB, callback, processCallback);

			expect(scene.physics.add.overlap).toHaveBeenCalledWith(
				objectA,
				objectB,
				expect.any(Function),
				processCallback,
				scene
			);
		});
	});

	describe('destroy', () => {
		it('should call destroy without errors', () => {
			expect(() => collisionManager.destroy()).not.toThrow();
		});
	});
});
