import { describe, it, expect, vi, beforeEach } from 'vitest';
import Mummy from './mummy.js';
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

describe('Mummy', () => {
	let mockScene;
	let mummy;

	beforeEach(() => {
		mockScene = {
			player: { x: 100, y: 100 },
		};

		mummy = new Mummy(mockScene, 250, 250, 'mummy1');
	});

	it('should initialize with correct position', () => {
		expect(mummy.x).toBe(250);
		expect(mummy.y).toBe(250);
	});

	it('should initialize with correct id', () => {
		expect(mummy.id).toBe('mummy1');
	});

	it('should use mummy sprite', () => {
		expect(mummy.spriteImage).toBe('mummy');
	});

	it('should have correct move speed', () => {
		expect(mummy.options.moveSpeed).toBe(enemyConfig.mummy.moveSpeed);
	});

	it('should have correct knockback', () => {
		expect(mummy.options.knockback).toBe(enemyConfig.mummy.knockback);
	});

	it('should use correct word category', () => {
		expect(mummy.options.wordCategory).toBe(enemyConfig.mummy.wordCategory);
	});

	it('should have correct drop table', () => {
		expect(mummy.options.dropTable).toEqual(enemyConfig.mummy.dropTable);
	});

	it('should have all expected item drops', () => {
		const dropTypes = mummy.options.dropTable.map((d) => d.itemType);
		expect(dropTypes).toContain('SHIELD');
		expect(dropTypes).toContain('RANDOM_WEAPON_DROP');
		expect(dropTypes).toContain('MEDKIT');
		expect(dropTypes).toContain('BOMB');
	});
});
