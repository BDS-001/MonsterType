/**
 * Item Data Configuration
 *
 * Defines all collectible items with their properties, words, and rarity.
 * Used by the item system to create collectible objects with typing challenges.
 */

/**
 * Central database of all collectible items in the game
 * Each item has typing word, effect type, and rarity for spawn balancing
 */
export const ITEM_DATA = {
	BOMB: {
		id: 'BOMB',
		name: 'Bomb',
		word: 'explode',
		type: 'consumable',
		rarity: 'common',
	},
	HEAVYROUNDS_PICKUP: {
		id: 'HEAVYROUNDS_PICKUP',
		name: 'Heavy Rounds',
		word: 'heavy',
		type: 'weapon',
		rarity: 'rare',
	},
	MEDKIT: {
		id: 'MEDKIT',
		name: 'Medkit',
		word: 'heal',
		type: 'consumable',
		rarity: 'common',
		baseValue: 10,
	},
	HEALTH_UP: {
		id: 'HEALTH_UP',
		name: 'Max Health Upgrade',
		word: 'endurance',
		type: 'upgrade',
		rarity: 'rare',
		baseValue: 10,
	},
};
