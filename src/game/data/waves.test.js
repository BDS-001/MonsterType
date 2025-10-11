import { describe, it, expect } from 'vitest';
import waves from './waves.json';

describe('Wave Data', () => {
	it('should have wave data', () => {
		expect(waves).toBeDefined();
		expect(typeof waves).toBe('object');
	});

	it('should have wave 1', () => {
		expect(waves['1']).toBeDefined();
		expect(waves['1'].enemies).toBeDefined();
	});

	it('wave 1 should have 3 zombies', () => {
		expect(waves['1'].enemies.zombie.count).toBe(3);
	});

	it('should have wave 30', () => {
		expect(waves['30']).toBeDefined();
		expect(waves['30'].enemies).toBeDefined();
	});

	it('should not have wave 31', () => {
		expect(waves['31']).not.toBeDefined();
	});
});
