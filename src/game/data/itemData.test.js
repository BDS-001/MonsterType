import { describe, it, expect } from 'vitest';
import ITEM_DATA from './items.json';

describe('Item Data Validation', () => {
	it('all items should have required properties', () => {
		Object.entries(ITEM_DATA).forEach(([key, item]) => {
			expect(item.name, `${key} missing name`).toBeDefined();
			expect(item.word, `${key} missing word`).toBeDefined();
			expect(item.type, `${key} missing type`).toBeDefined();
			expect(item.rarity, `${key} missing rarity`).toBeDefined();
		});
	});
});
