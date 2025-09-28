import Phaser from 'phaser';

export const phaserConfig = {
	type: Phaser.AUTO,
	width: 1600,
	height: 900,
	backgroundColor: '#222',
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},

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

export const gameSettings = {
	SPRITE_SCALE: 3,
	ITEM_SPRITE_SCALE: 2,
};
