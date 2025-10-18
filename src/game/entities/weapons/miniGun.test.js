import { describe, it, expect, vi } from 'vitest';
import Minigun from './miniGun.js';

vi.mock('./weapon.js', () => ({
	default: class Weapon {
		constructor(name, description, config) {
			this.name = name;
			this.description = description;
			this.config = config;
		}
	},
}));

describe('Minigun', () => {
	it('should initialize with correct properties', () => {
		const minigun = new Minigun();

		expect(minigun.name).toBe('Minigun');
		expect(minigun.description).toBe('Fast firing gun that targets multiple enemies.');
		expect(minigun.config.attackAnimation).toBe('basic');
		expect(minigun.config.maxTargets).toBe(10);
		expect(minigun.config.maxUsages).toBe(150);
	});
});
