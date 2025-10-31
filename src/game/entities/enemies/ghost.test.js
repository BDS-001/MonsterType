import { describe, it, expect, vi, beforeEach } from 'vitest';
import Ghost from './ghost.js';
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

describe('Ghost', () => {
	let mockScene;
	let ghost;

	beforeEach(() => {
		mockScene = {
			player: { x: 100, y: 100 },
		};

		ghost = new Ghost(mockScene, 300, 300, 'ghost1');
	});

	it('should initialize with correct position', () => {
		expect(ghost.x).toBe(300);
		expect(ghost.y).toBe(300);
	});

	it('should initialize with correct id', () => {
		expect(ghost.id).toBe('ghost1');
	});

	it('should use ghost sprite', () => {
		expect(ghost.spriteImage).toBe('ghost');
	});

	it('should have correct move speed', () => {
		expect(ghost.options.moveSpeed).toBe(enemyConfig.ghost.moveSpeed);
	});

	it('should have correct knockback', () => {
		expect(ghost.options.knockback).toBe(enemyConfig.ghost.knockback);
	});

	it('should use correct word category', () => {
		expect(ghost.options.wordCategory).toBe(enemyConfig.ghost.wordCategory);
	});

	it('should have correct drop table', () => {
		expect(ghost.options.dropTable).toEqual(enemyConfig.ghost.dropTable);
	});

	it('should have all expected item drops', () => {
		const dropTypes = ghost.options.dropTable.map((d) => d.itemType);
		expect(dropTypes).toContain('SHIELD');
		expect(dropTypes).toContain('BOMB');
	});
});
