import { describe, it, expect, vi, beforeEach } from 'vitest';
import Zombie from './zombie.js';
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
	},
}));

describe('Zombie', () => {
	let mockScene;
	let zombie;

	beforeEach(() => {
		mockScene = {
			player: { x: 100, y: 100 },
		};

		zombie = new Zombie(mockScene, 200, 200, 'zombie1');
	});

	it('should initialize with correct position', () => {
		expect(zombie.x).toBe(200);
		expect(zombie.y).toBe(200);
	});

	it('should initialize with correct id', () => {
		expect(zombie.id).toBe('zombie1');
	});

	it('should use zombie sprite', () => {
		expect(zombie.spriteImage).toBe('zombie');
	});

	it('should have correct move speed', () => {
		expect(zombie.options.moveSpeed).toBe(enemyConfig.zombie.moveSpeed);
	});

	it('should have correct knockback', () => {
		expect(zombie.options.knockback).toBe(enemyConfig.zombie.knockback);
	});

	it('should use correct word category', () => {
		expect(zombie.options.wordCategory).toBe(enemyConfig.zombie.wordCategory);
	});

	it('should have correct drop table', () => {
		expect(zombie.options.dropTable).toEqual(enemyConfig.zombie.dropTable);
	});

	it('should have all expected item drops', () => {
		const dropTypes = zombie.options.dropTable.map((d) => d.itemType);
		expect(dropTypes).toContain('MEDKIT');
		expect(dropTypes).toContain('SHIELD');
		expect(dropTypes).toContain('RANDOM_WEAPON_DROP');
		expect(dropTypes).toContain('BOMB');
	});
});
