import { GAME_EVENTS } from '../core/GameEvents.js';
import { TEXT_STYLES } from '../config/fontConfig.js';

export class GameOver extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOver' });
		this.playAgainButton = null;
	}

	create() {
		this.cameras.main.setBackgroundColor('rgba(0,0,0,0.3)');

		this.add
			.text(this.game.config.width / 2, this.game.config.height / 2 - 110, 'GAME OVER', {
				...TEXT_STYLES.UI_LARGE,
				color: '#ff4444',
			})
			.setOrigin(0.5)
			.setShadow(0, 4, '#000000', 6, true, true);

		const playAgainButton = this.add
			.text(
				this.game.config.width / 2,
				this.game.config.height / 2,
				'PLAY AGAIN',
				TEXT_STYLES.UI_LARGE
			)
			.setOrigin(0.5);
		playAgainButton.setInteractive({ useHandCursor: true });
		this.playAgainButton = playAgainButton;

		playAgainButton.on('pointerdown', this.playAgain, this);

		playAgainButton.on('pointerover', () => {
			this.tweens.killTweensOf(playAgainButton);
			this.tweens.add({
				targets: playAgainButton,
				scaleX: 1.12,
				scaleY: 1.12,
				duration: 120,
				ease: 'Sine.easeOut',
			});
		});
		playAgainButton.on('pointerout', () => {
			this.tweens.killTweensOf(playAgainButton);
			this.tweens.add({
				targets: playAgainButton,
				scaleX: 1,
				scaleY: 1,
				duration: 120,
				ease: 'Sine.easeOut',
			});
		});

		this.cameras.main.roundPixels = true;
	}

	playAgain() {
		this.game.events.emit(GAME_EVENTS.GAME_OVER, { reset: true });
		this.scene.stop('GameScene');
		this.scene.start('GameScene');
		this.scene.launch('HudScene');
	}

	destroy() {
		super.destroy();
	}
}
