import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockScene } from '../../../test-utils/scene.mock.js';
import Crossbow from './crossbow.js';
import { getDamageableEnemiesInRadius } from '../../util/physicsUtils.js';

vi.mock('./weapon.js', () => ({
	default: class Weapon {
		constructor(name, description, config) {
			this.name = name;
			this.description = description;
			this.config = config;
		}
	},
}));

vi.mock('../../util/physicsUtils.js', () => ({
	getDamageableEnemiesInRadius: vi.fn(),
}));

vi.mock('../../core/GameEvents.js', () => ({
	GAME_EVENTS: { WEAPON_FIRED: 'WEAPON_FIRED' },
}));

describe('Crossbow', () => {
	let crossbow;
	let mockScene;
	let mockPlayer;
	let mockTarget;

	beforeEach(() => {
		vi.clearAllMocks();

		mockPlayer = { x: 100, y: 100 };
		mockTarget = {
			id: 'target1',
			x: 200,
			y: 100,
			takeDamage: vi.fn(),
		};

		mockScene = createMockScene({ player: mockPlayer });

		crossbow = new Crossbow();
		crossbow.scene = mockScene;
	});

	it('should initialize with correct properties', () => {
		expect(crossbow.name).toBe('Crossbow');
		expect(crossbow.description).toBe('Fires bolts that ricochet between multiple enemies');
		expect(crossbow.config.maxTargets).toBe(1);
		expect(crossbow.config.attackAnimation).toBe('crossbow');
		expect(crossbow.config.maxUsages).toBe(40);
		expect(crossbow.ricochetCount).toBe(3);
		expect(crossbow.range).toBe(300);
	});

	describe('shotEffect', () => {
		it('should damage primary target', () => {
			getDamageableEnemiesInRadius.mockReturnValue([]);

			crossbow.shotEffect(mockTarget);

			expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
		});

		it('should emit weapon fired event for primary target', () => {
			getDamageableEnemiesInRadius.mockReturnValue([]);

			crossbow.shotEffect(mockTarget);

			expect(mockScene.events.emit).toHaveBeenCalledWith('WEAPON_FIRED', {
				target: mockTarget,
				weapon: crossbow,
				originX: 100,
				originY: 100,
			});
		});

		it('should not fire when player is missing', () => {
			mockScene.player = null;

			crossbow.shotEffect(mockTarget);

			expect(mockTarget.takeDamage).not.toHaveBeenCalled();
		});

		it('should ricochet to nearby enemies', () => {
			const enemy2 = {
				id: 'enemy2',
				x: 250,
				y: 100,
				takeDamage: vi.fn(),
			};

			const enemy3 = {
				id: 'enemy3',
				x: 300,
				y: 100,
				takeDamage: vi.fn(),
			};

			getDamageableEnemiesInRadius
				.mockReturnValueOnce([enemy2])
				.mockReturnValueOnce([enemy3])
				.mockReturnValueOnce([]);

			crossbow.shotEffect(mockTarget);

			expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
			expect(enemy2.takeDamage).toHaveBeenCalledTimes(1);
			expect(enemy3.takeDamage).toHaveBeenCalledTimes(1);
		});
	});

	describe('ricochet', () => {
		it('should stop when remaining ricochets is 0', () => {
			const visited = new Set([mockTarget]);

			crossbow.ricochet(200, 100, visited, 0);

			expect(getDamageableEnemiesInRadius).not.toHaveBeenCalled();
		});

		it('should stop when no target is found', () => {
			getDamageableEnemiesInRadius.mockReturnValue([]);
			const visited = new Set([mockTarget]);

			crossbow.ricochet(200, 100, visited, 3);

			expect(getDamageableEnemiesInRadius).toHaveBeenCalledWith(mockScene, 200, 100, 300);
		});

		it('should damage and emit event for ricochet target', () => {
			const nextTarget = {
				id: 'enemy2',
				x: 250,
				y: 150,
				takeDamage: vi.fn(),
			};

			getDamageableEnemiesInRadius.mockReturnValueOnce([nextTarget]).mockReturnValueOnce([]);

			const visited = new Set([mockTarget]);
			crossbow.ricochet(200, 100, visited, 2);

			expect(nextTarget.takeDamage).toHaveBeenCalledTimes(1);
			expect(mockScene.events.emit).toHaveBeenCalledWith('WEAPON_FIRED', {
				target: nextTarget,
				weapon: crossbow,
				originX: 200,
				originY: 100,
			});
			expect(visited.has(nextTarget)).toBe(true);
		});

		it('should chain multiple ricochets', () => {
			const enemy2 = { id: 'enemy2', x: 250, y: 100, takeDamage: vi.fn() };
			const enemy3 = { id: 'enemy3', x: 300, y: 100, takeDamage: vi.fn() };
			const enemy4 = { id: 'enemy4', x: 350, y: 100, takeDamage: vi.fn() };

			getDamageableEnemiesInRadius
				.mockReturnValueOnce([enemy2])
				.mockReturnValueOnce([enemy3])
				.mockReturnValueOnce([enemy4])
				.mockReturnValueOnce([]);

			const visited = new Set([mockTarget]);
			crossbow.ricochet(200, 100, visited, 3);

			expect(enemy2.takeDamage).toHaveBeenCalledTimes(1);
			expect(enemy3.takeDamage).toHaveBeenCalledTimes(1);
			expect(enemy4.takeDamage).toHaveBeenCalledTimes(1);
			expect(mockScene.events.emit).toHaveBeenCalledTimes(3);
		});
	});

	describe('findClosestTarget', () => {
		it('should return null when no targets in radius', () => {
			getDamageableEnemiesInRadius.mockReturnValue([]);
			const visited = new Set();

			const result = crossbow.findClosestTarget(100, 100, visited);

			expect(result).toBeNull();
		});

		it('should return closest unvisited target', () => {
			const nearEnemy = { id: 'near', x: 150, y: 100, takeDamage: vi.fn() };
			const farEnemy = { id: 'far', x: 300, y: 100, takeDamage: vi.fn() };

			getDamageableEnemiesInRadius.mockReturnValue([farEnemy, nearEnemy]);
			const visited = new Set();

			const result = crossbow.findClosestTarget(100, 100, visited);

			expect(result).toBe(nearEnemy);
		});

		it('should skip visited targets', () => {
			const nearEnemy = { id: 'near', x: 150, y: 100, takeDamage: vi.fn() };
			const farEnemy = { id: 'far', x: 300, y: 100, takeDamage: vi.fn() };

			getDamageableEnemiesInRadius.mockReturnValue([nearEnemy, farEnemy]);
			const visited = new Set([nearEnemy]);

			const result = crossbow.findClosestTarget(100, 100, visited);

			expect(result).toBe(farEnemy);
		});

		it('should return null when all targets are visited', () => {
			const enemy1 = { id: 'enemy1', x: 150, y: 100, takeDamage: vi.fn() };
			const enemy2 = { id: 'enemy2', x: 200, y: 100, takeDamage: vi.fn() };

			getDamageableEnemiesInRadius.mockReturnValue([enemy1, enemy2]);
			const visited = new Set([enemy1, enemy2]);

			const result = crossbow.findClosestTarget(100, 100, visited);

			expect(result).toBeNull();
		});

		it('should use squared distance for comparison', () => {
			const enemy1 = { id: 'enemy1', x: 103, y: 104, takeDamage: vi.fn() };
			const enemy2 = { id: 'enemy2', x: 106, y: 100, takeDamage: vi.fn() };
			const enemy3 = { id: 'enemy3', x: 107, y: 100, takeDamage: vi.fn() };

			getDamageableEnemiesInRadius.mockReturnValue([enemy3, enemy2, enemy1]);
			const visited = new Set();

			const result = crossbow.findClosestTarget(100, 100, visited);

			expect(result).toBe(enemy1);
		});
	});
});
