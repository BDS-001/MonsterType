import { describe, it, expect, vi, beforeEach } from 'vitest';
import ItemManager from './ItemManager.js';
import { createMockScene } from '../../test-utils/scene.mock.js';

vi.mock('../entities/items/item', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/items/medkit', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/items/bomb', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/items/healthUp', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/items/randomWeaponDrop', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/items/shield', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/items/blizzard', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/items/thunderstorm', () => ({
	default: vi.fn(),
}));

vi.mock('../entities/items/multiplier', () => ({
	default: vi.fn(),
}));

vi.mock('../core/BaseManager.js', () => ({
	default: class BaseManager {
		constructor(scene) {
			this.scene = scene;
		}
		subscribe() {}
		destroy() {}
		destroyGroup() {}
	},
}));

vi.mock('../core/GameEvents.js', () => ({
	GAME_EVENTS: {
		ITEM_SPAWNED: 'ITEM_SPAWNED',
	},
}));

describe('ItemManager', () => {
	let mockScene;
	let itemManager;
	let mockGroup;

	beforeEach(() => {
		mockGroup = {
			children: { entries: [] },
			add: vi.fn(),
			getChildren: vi.fn(() => []),
		};

		mockScene = createMockScene({ add: { group: vi.fn(() => mockGroup) } });

		itemManager = new ItemManager(mockScene);
	});

	it('should initialize with correct properties', () => {
		expect(itemManager.items).toBe(mockGroup);
		expect(itemManager.currentItemId).toBe(0);
		expect(itemManager.itemTypes.size).toBe(8);
	});

	it('should have all item types registered', () => {
		expect(itemManager.itemTypes.has('MEDKIT')).toBe(true);
		expect(itemManager.itemTypes.has('BOMB')).toBe(true);
		expect(itemManager.itemTypes.has('SHIELD')).toBe(true);
		expect(itemManager.itemTypes.has('HEALTH_UP')).toBe(true);
		expect(itemManager.itemTypes.has('RANDOM_WEAPON_DROP')).toBe(true);
		expect(itemManager.itemTypes.has('BLIZZARD')).toBe(true);
		expect(itemManager.itemTypes.has('THUNDERSTORM')).toBe(true);
		expect(itemManager.itemTypes.has('MULTIPLIER')).toBe(true);
	});

	it('should spawn item with adjusted coordinates', () => {
		const mockItem = { isDestroyed: false };
		const ItemClass = vi.fn(() => mockItem);
		itemManager.itemTypes.set('TEST_ITEM', ItemClass);

		const result = itemManager.spawnItem({
			x: 100,
			y: 100,
			itemType: 'TEST_ITEM',
		});

		expect(ItemClass).toHaveBeenCalledWith(mockScene, 100, 100, 'item0');
		expect(mockGroup.add).toHaveBeenCalledWith(mockItem);
		expect(result).toBe(mockItem);
		expect(itemManager.currentItemId).toBe(1);
	});

	it('should increment item ID after spawning', () => {
		const mockItem = { isDestroyed: false };
		const ItemClass = vi.fn(() => mockItem);
		itemManager.itemTypes.set('TEST_ITEM', ItemClass);

		itemManager.spawnItem({ x: 100, y: 100, itemType: 'TEST_ITEM' });
		expect(itemManager.currentItemId).toBe(1);

		itemManager.spawnItem({ x: 200, y: 200, itemType: 'TEST_ITEM' });
		expect(itemManager.currentItemId).toBe(2);
	});

	it('should get items group', () => {
		expect(itemManager.getItems()).toBe(mockGroup);
	});

	it('should return item count', () => {
		mockGroup.getChildren.mockReturnValue([{}, {}, {}]);
		expect(itemManager.getItemCount()).toBe(3);
	});

	it('should update all active items', () => {
		const item1 = { isDestroyed: false, update: vi.fn() };
		const item2 = { isDestroyed: false, update: vi.fn() };
		mockGroup.children.entries = [item1, item2];

		itemManager.update(16);

		expect(item1.update).toHaveBeenCalledWith(16);
		expect(item2.update).toHaveBeenCalledWith(16);
	});

	it('should not update destroyed items', () => {
		const item1 = { isDestroyed: true, update: vi.fn() };
		const item2 = { isDestroyed: false, update: vi.fn() };
		mockGroup.children.entries = [item1, item2];

		itemManager.update(16);

		expect(item1.update).not.toHaveBeenCalled();
		expect(item2.update).toHaveBeenCalledWith(16);
	});
});
