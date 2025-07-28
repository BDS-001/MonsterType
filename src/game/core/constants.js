/**
 * Game Configuration Constants
 *
 * Contains all core configuration settings for the KeyStrike game,
 * including Phaser.js engine settings and gameplay parameters.
 */
import Phaser from 'phaser';

/**
 * Phaser.js engine configuration
 * Defines rendering, physics, and performance settings for the game
 */
export const phaserConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: '#222',
	pixelArt: true,

	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false,
		},
	},
	render: {
		fps: {
			min: 10,
			target: 60,
			limit: 120,
			forceSetTimeOut: false,
			deltaHistory: 10,
		},
	},
};

/**
 * Gameplay-specific settings and constants
 * Controls various aspects of game mechanics and visual scaling
 */
export const gameSettings = {
	SPRITE_SCALE: 4,
};
