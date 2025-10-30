import { describe, it, expect, vi, beforeEach } from 'vitest';
import Multiplier from './multiplier.js';

vi.mock('./item.js', () => ({
	default: class Item {
		constructor(scene, x, y, itemType, itemId, spriteKey) {
			this.scene = scene;
			this.x = x;
			this.y = y;
			this.itemType = itemType;
			this.itemId = itemId;
			this.spriteKey = spriteKey;
			this.config = {
				multiplierBoost: 2,
				duration: 10000,
			};
		}
		onKill() {}
	},
}));

vi.mock('../../core/GameEvents.js', () => ({
	GAME_EVENTS: {
		MULTIPLIER_BOOST_COLLECTED: 'MULTIPLIER_BOOST_COLLECTED',
	},
}));

describe('Multiplier', () => {
	let mockScene;
	let multiplier;

	beforeEach(() => {
		mockScene = {
			events: {
				emit: vi.fn(),
			},
		};

		multiplier = new Multiplier(mockScene, 100, 200, 'multiplier1');
	});

	it('should initialize with correct properties', () => {
		expect(multiplier.itemType).toBe('MULTIPLIER');
		expect(multiplier.spriteKey).toBe('item-sprite');
	});

	it('should emit multiplier boost event on kill', () => {
		multiplier.onKill();

		expect(mockScene.events.emit).toHaveBeenCalledWith(
			'MULTIPLIER_BOOST_COLLECTED',
			{
				boost: 2,
				duration: 10000,
			}
		);
	});
});
