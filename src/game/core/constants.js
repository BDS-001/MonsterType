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
	// Renderer type - AUTO lets Phaser choose WebGL or Canvas based on support
	type: Phaser.AUTO,
	// Default canvas dimensions (will be adjusted to viewport in Game class)
	width: 800,
	height: 600,
	// Dark background color for the game
	backgroundColor: '#222',
	// Enable pixel art rendering for crisp sprite scaling
	pixelArt: true,

	// Physics engine configuration
	physics: {
		// Use Arcade physics for simple 2D collisions and movement
		default: 'arcade',
		arcade: {
			// No gravity - top-down perspective game
			gravity: { y: 0 },
			// Disable physics debug visualization
			debug: false,
		},
	},
	// Rendering and performance settings
	render: {
		fps: {
			// Minimum acceptable framerate before performance adjustments
			min: 10,
			// Target framerate for optimal gameplay
			target: 60,
			// Maximum framerate cap to prevent excessive resource usage
			limit: 120,
			// Use requestAnimationFrame instead of setTimeout for better performance
			forceSetTimeOut: false,
			// Number of frame times to track for smooth framerate calculations
			deltaHistory: 10,
		},
	},
};

/**
 * Gameplay-specific settings and constants
 * Controls various aspects of game mechanics and visual scaling
 */
export const gameSettings = {
	// Scale factor for all sprite rendering (4x original size for pixel art)
	SPRITE_SCALE: 4,
};
