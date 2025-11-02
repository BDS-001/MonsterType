import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockScene } from '../../../test-utils/scene.mock.js';
import Shotgun from './shotgun.js';
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

describe('Shotgun', () => {
	let shotgun;
	let mockScene;
	let mockPlayer;
	let mockTarget;

	beforeEach(() => {
		mockPlayer = { x: 100, y: 100 };
		mockTarget = {
			id: 'target1',
			x: 200,
			y: 100,
			takeDamage: vi.fn(),
		};

		mockScene = createMockScene({ player: mockPlayer });

		shotgun = new Shotgun();
		shotgun.scene = mockScene;
	});

	it('should initialize with correct properties', () => {
		expect(shotgun.name).toBe('Shotgun');
		expect(shotgun.description).toBe('Spreads pellets in a cone, hitting multiple enemies');
		expect(shotgun.config.maxTargets).toBe(1);
		expect(shotgun.config.attackAnimation).toBe('shotgun');
		expect(shotgun.config.maxUsages).toBe(30);
		expect(shotgun.halfAngle).toBe(0.6);
		expect(shotgun.maxRange).toBe(1200);
		expect(shotgun.pelletFxCount).toBe(16);
	});

	describe('shotEffect', () => {
		it('should damage primary target', () => {
			getDamageableEnemiesInRadius.mockReturnValue([mockTarget]);

			shotgun.shotEffect(mockTarget);

			expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
		});

		it('should damage secondary targets in cone', () => {
			const secondaryTarget = {
				id: 'secondary',
				x: 250,
				y: 110,
				takeDamage: vi.fn(),
			};

			getDamageableEnemiesInRadius.mockReturnValue([mockTarget, secondaryTarget]);

			shotgun.shotEffect(mockTarget);

			expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
			expect(secondaryTarget.takeDamage).toHaveBeenCalledTimes(1);
		});

		it('should emit weapon fired event with correct data', () => {
			getDamageableEnemiesInRadius.mockReturnValue([mockTarget]);

			shotgun.shotEffect(mockTarget);

			expect(mockScene.events.emit).toHaveBeenCalledWith('WEAPON_FIRED', {
				target: mockTarget,
				weapon: shotgun,
				pelletFxCount: 16,
				halfAngle: 0.6,
				maxRange: 1200,
				originX: 100,
				originY: 100,
			});
		});

		it('should not damage primary target twice', () => {
			getDamageableEnemiesInRadius.mockReturnValue([mockTarget]);

			shotgun.shotEffect(mockTarget);

			expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
		});
	});

	describe('findConeTargets', () => {
		it('should return empty array when player is missing', () => {
			mockScene.player = null;

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).toEqual([]);
		});

		it('should return empty array when no targets in radius', () => {
			getDamageableEnemiesInRadius.mockReturnValue([]);

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).toEqual([]);
		});

		it('should exclude primary target from cone targets', () => {
			getDamageableEnemiesInRadius.mockReturnValue([mockTarget]);

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).toEqual([]);
		});

		it('should include enemies within cone angle', () => {
			const enemyInCone = {
				id: 'inCone',
				x: 250,
				y: 110,
				takeDamage: vi.fn(),
			};

			getDamageableEnemiesInRadius.mockReturnValue([mockTarget, enemyInCone]);

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).toContain(enemyInCone);
		});

		it('should exclude enemies outside cone angle', () => {
			const enemyOutOfCone = {
				id: 'outOfCone',
				x: 150,
				y: 300,
				takeDamage: vi.fn(),
			};

			getDamageableEnemiesInRadius.mockReturnValue([mockTarget, enemyOutOfCone]);

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).not.toContain(enemyOutOfCone);
		});

		it('should exclude enemies behind player', () => {
			const enemyBehind = {
				id: 'behind',
				x: 50,
				y: 100,
				takeDamage: vi.fn(),
			};

			getDamageableEnemiesInRadius.mockReturnValue([mockTarget, enemyBehind]);

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).not.toContain(enemyBehind);
		});

		it('should handle target at same position as player', () => {
			mockTarget.x = 100;
			mockTarget.y = 100;

			getDamageableEnemiesInRadius.mockReturnValue([mockTarget]);

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).toEqual([]);
		});

		it('should handle secondary target at same position as player', () => {
			const enemyAtPlayer = {
				id: 'atPlayer',
				x: 100,
				y: 100,
				takeDamage: vi.fn(),
			};

			getDamageableEnemiesInRadius.mockReturnValue([mockTarget, enemyAtPlayer]);

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).not.toContain(enemyAtPlayer);
		});

		it('should correctly identify multiple enemies in cone', () => {
			const enemy1 = { id: 'enemy1', x: 250, y: 110, takeDamage: vi.fn() };
			const enemy2 = { id: 'enemy2', x: 300, y: 100, takeDamage: vi.fn() };
			const enemy3 = { id: 'enemy3', x: 280, y: 90, takeDamage: vi.fn() };
			const enemyOut = { id: 'enemyOut', x: 150, y: 300, takeDamage: vi.fn() };

			getDamageableEnemiesInRadius.mockReturnValue([mockTarget, enemy1, enemy2, enemy3, enemyOut]);

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).toContain(enemy1);
			expect(result).toContain(enemy2);
			expect(result).toContain(enemy3);
			expect(result).not.toContain(enemyOut);
		});

		it('should use correct angle calculation for cone', () => {
			const enemyAtAngle = {
				id: 'atAngle',
				x: 200 + 100 * Math.cos(0.3),
				y: 100 + 100 * Math.sin(0.3),
				takeDamage: vi.fn(),
			};

			getDamageableEnemiesInRadius.mockReturnValue([mockTarget, enemyAtAngle]);

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).toContain(enemyAtAngle);
		});

		it('should correctly filter using dot product and angle threshold', () => {
			const enemyJustInside = {
				id: 'justInside',
				x: 100 + 150 * Math.cos(0.5),
				y: 100 + 150 * Math.sin(0.5),
				takeDamage: vi.fn(),
			};

			const enemyJustOutside = {
				id: 'justOutside',
				x: 100 + 150 * Math.cos(0.7),
				y: 100 + 150 * Math.sin(0.7),
				takeDamage: vi.fn(),
			};

			getDamageableEnemiesInRadius.mockReturnValue([mockTarget, enemyJustInside, enemyJustOutside]);

			const result = shotgun.findConeTargets(mockTarget);

			expect(result).toContain(enemyJustInside);
			expect(result).not.toContain(enemyJustOutside);
		});
	});
});
