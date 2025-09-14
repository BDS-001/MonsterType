import './style.css';
import Game from './game/core/game';
import { phaserConfig } from './game/core/constants';
import { FONT_CONFIG } from './game/config/fontConfig';

async function boot() {
	try {
		const fontUrl = new URL(`${import.meta.env.BASE_URL}${FONT_CONFIG.PATH}`, window.location.href);
		const fontFace = new FontFace(
			FONT_CONFIG.NAME,
			`url(${fontUrl}) format('${FONT_CONFIG.FORMAT}')`
		);
		await fontFace.load();
		document.fonts.add(fontFace);
		await document.fonts.ready;
	} catch (e) {
		console.warn('Font load warning: using fallback font', e);
	}

	new Game(phaserConfig);
}

boot();
