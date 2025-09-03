/**
 * MonsterType Game Entry Point
 *
 * A typing-based action game built with Phaser.js where players type words
 * to eliminate enemies and survive waves of attacks.
 */
import './style.css';
import Game from './game/core/game';
import { phaserConfig } from './game/core/constants';

// Load Press Start 2P locally (works with Vite base path) then start the game
async function boot() {
	try {
		const fontUrl = new URL(
			`${import.meta.env.BASE_URL}fonts/Press_Start_2P/PressStart2P-Regular.ttf`,
			window.location.href
		);
		const fontFace = new FontFace('Press Start 2P', `url(${fontUrl}) format('truetype')`);
		await fontFace.load();
		document.fonts.add(fontFace);
		await document.fonts.ready;
	} catch (e) {
		console.warn('Font load warning: using fallback font', e);
	}

	// Initialize and start the game
	new Game(phaserConfig);
}

boot();
