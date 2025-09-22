import { GAME_EVENTS } from '../core/GameEvents.js';
import { TEXT_STYLES } from '../config/fontConfig.js';

export class GameOver extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOver', active: true });
		this.playAgainButton = null;
	}

	preload() {}

	create() {
		this.scene.setVisible(false);
		this.input.enabled = false;
		this.game.events.on(GAME_EVENTS.GAME_OVER, this.onGameOverEvent, this);

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
			this.tweens.add({
				targets: playAgainButton,
				scaleX: 1.12,
				scaleY: 1.12,
				duration: 120,
				ease: 'Sine.easeOut',
			});
		});
		playAgainButton.on('pointerout', () => {
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
		this.input.enabled = false;
		this.game.events.emit(GAME_EVENTS.GAME_OVER, { reset: true });
		this.scene.setVisible(false);
		this.scene.start('GameScene');
	}

	onGameOverEvent(data) {
		if (data && data.reset) return;
		this.input.enabled = true;
		this.scene.setVisible(true);
	}

	destroy() {
		this.game.events.off(GAME_EVENTS.GAME_OVER, this.onGameOverEvent, this);
		super.destroy();
	}
}
