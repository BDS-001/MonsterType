import { describe, it, expect, vi } from 'vitest';
import DualPistols from './dualPistols.js';

vi.mock('./weapon.js', () => ({
	default: class Weapon {
		constructor(name, description, config) {
			this.name = name;
			this.description = description;
			this.config = config;
		}
	},
}));

describe('DualPistols', () => {
	it('should initialize with correct properties', () => {
		const dualPistols = new DualPistols();

		expect(dualPistols.name).toBe('Dual Pistols');
		expect(dualPistols.description).toBe('Fast firing gun that targets multiple enemies.');
		expect(dualPistols.config.attackAnimation).toBe('basic');
		expect(dualPistols.config.maxTargets).toBe(2);
		expect(dualPistols.config.maxUsages).toBe(150);
	});
});
