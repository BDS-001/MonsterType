import { TEXT_STYLES } from '../config/fontConfig.js';

export class PauseScene extends Phaser.Scene {
	constructor() {
		super({ key: 'PauseScene', active: true });
	}
	create() {
		this.scene.setVisible(false);
		this.cameras.main.setBackgroundColor('rgba(0,0,0,0.3)');

		this.input.keyboard.on('keydown-ESC', () => {
			const gameSceneKey = 'GameScene';

			if (this.scene.isPaused(gameSceneKey)) {
				this.scene.resume(gameSceneKey);
				this.scene.setVisible(false);
			} else {
				this.scene.pause(gameSceneKey);
				this.scene.setVisible(true);
			}
		});
		this.add
			.text(
				this.game.config.width / 2,
				this.game.config.height / 2,
				'PAUSED\n\nPress ESC to Resume',
				{ ...TEXT_STYLES.UI_LARGE, align: 'center' }
			)
			.setOrigin(0.5)
			.setShadow(0, 4, '#000000', 6, true, true);

		this.cameras.main.roundPixels = true;
	}
}
