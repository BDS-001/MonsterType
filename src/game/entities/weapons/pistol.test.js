import { describe, it, expect, vi } from 'vitest';
import Pistol from './pistol.js';

vi.mock('./weapon.js', () => ({
	default: class Weapon {
		constructor(name, description, config) {
			this.name = name;
			this.description = description;
			this.config = config;
		}
	},
}));

describe('Pistol', () => {
	it('should initialize with correct properties', () => {
		const pistol = new Pistol();

		expect(pistol.name).toBe('Pistol');
		expect(pistol.description).toBe('A standard pistol with unlimited ammo.');
		expect(pistol.config.attackAnimation).toBe('basic');
	});

	it('should have no max usages (unlimited ammo)', () => {
		const pistol = new Pistol();

		expect(pistol.config.maxUsages).toBeUndefined();
	});
});
