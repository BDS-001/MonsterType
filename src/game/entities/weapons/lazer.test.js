import { describe, it, expect, vi, beforeEach } from 'vitest';
import LazerGun from './lazer.js';
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

global.Phaser = {
	Math: {
		Angle: {
			Between: vi.fn((x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1)),
		},
	},
};

describe('LazerGun', () => {
	let lazer;
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

		mockScene = {
			player: mockPlayer,
			events: {
				emit: vi.fn(),
			},
		};

		lazer = new LazerGun();
		lazer.scene = mockScene;
	});

	it('should initialize with correct properties', () => {
		expect(lazer.name).toBe('Lazer Gun');
		expect(lazer.lazerLength).toBe(1500);
		expect(lazer.lazerWidth).toBe(60);
		expect(lazer.config.maxTargets).toBe(1);
		expect(lazer.config.maxUsages).toBe(20);
	});

	it('should damage primary target on shot', () => {
		getDamageableEnemiesInRadius.mockReturnValue([]);

		lazer.shotEffect(mockTarget);

		expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
	});

	it('should emit weapon fired event with correct data', () => {
		getDamageableEnemiesInRadius.mockReturnValue([]);

		lazer.shotEffect(mockTarget);

		expect(mockScene.events.emit).toHaveBeenCalledWith('WEAPON_FIRED', {
			target: mockTarget,
			weapon: lazer,
			lazerLength: 1500,
			lazerWidth: 60,
			originX: 100,
			originY: 100,
		});
	});

	it('should damage enemies in line with laser', () => {
		const enemyInLine = {
			id: 'enemy2',
			x: 250,
			y: 100,
			takeDamage: vi.fn(),
		};

		const enemyOutOfLine = {
			id: 'enemy3',
			x: 250,
			y: 200,
			takeDamage: vi.fn(),
		};

		getDamageableEnemiesInRadius.mockReturnValue([mockTarget, enemyInLine, enemyOutOfLine]);

		lazer.shotEffect(mockTarget);

		expect(enemyInLine.takeDamage).toHaveBeenCalled();
		expect(enemyOutOfLine.takeDamage).not.toHaveBeenCalled();
	});

	it('should not damage primary target twice', () => {
		getDamageableEnemiesInRadius.mockReturnValue([mockTarget]);

		lazer.shotEffect(mockTarget);

		expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
	});

	it('should not damage enemies behind player', () => {
		const enemyBehind = {
			id: 'enemy4',
			x: 50,
			y: 100,
			takeDamage: vi.fn(),
		};

		getDamageableEnemiesInRadius.mockReturnValue([mockTarget, enemyBehind]);

		lazer.shotEffect(mockTarget);

		expect(enemyBehind.takeDamage).not.toHaveBeenCalled();
	});
});
