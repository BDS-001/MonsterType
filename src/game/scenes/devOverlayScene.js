import { TEXT_STYLES } from '../config/fontConfig.js';
import { applyTextShadow } from '../util/textEffects.js';

export class DevOverlayScene extends Phaser.Scene {
	constructor() {
		super({ key: 'DevOverlayScene' });
		this.PADDING = 20;
	}

	create() {
		const devBadge = this.add
			.text(this.PADDING, this.PADDING + 50, 'GAME IS WORK IN PROGRESS', TEXT_STYLES.UI_TINY)
			.setOrigin(0, 0)
			.setAlpha(0.9)
			.setDepth(10000);
		applyTextShadow(devBadge);

		this.cameras.main.roundPixels = true;
	}
}
