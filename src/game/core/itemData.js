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
	// Explosive consumable item
	BOMB: {
		id: 'BOMB', // Unique identifier
		name: 'Bomb', // Display name
		word: 'explode', // Word to type for collection
		type: 'consumable', // Item category
		rarity: 'common', // Spawn frequency modifier
	},
	// Weapon upgrade pickup
	HEAVYROUNDS_PICKUP: {
		id: 'HEAVYROUNDS_PICKUP', // Unique identifier
		name: 'Heavy Rounds', // Display name
		word: 'heavy', // Word to type for collection
		type: 'weapon', // Weapon upgrade category
		rarity: 'rare', // Higher rarity for weapon upgrades
	},
	// Health restoration item
	MEDKIT: {
		id: 'MEDKIT', // Unique identifier
		name: 'Medkit', // Display name
		word: 'heal', // Word to type for collection
		type: 'consumable', // Consumable health item
		rarity: 'common', // Common spawn for health management
	},
	// Permanent health increase upgrade
	HEALTH_UP: {
		id: 'HEALTH_UP', // Unique identifier
		name: 'Max Health Upgrade', // Display name
		word: 'endurance', // Complex word for powerful upgrade
		type: 'upgrade', // Permanent upgrade category
		rarity: 'rare', // Rare spawn for powerful effects
	},
};
