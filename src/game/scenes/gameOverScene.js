import { GAME_EVENTS } from '../core/GameEvents.js';

export class GameOver extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOver', active: true });
		this.playAgainButton = null;
	}

	preload() {
		this.load.image('playagain', 'assets/ui/playagain.png');
	}

	create() {
		this.scene.setVisible(false);
		this.input.enabled = false;
		this.game.events.on(GAME_EVENTS.GAME_OVER, this.onGameOverEvent, this);

		this.cameras.main.setBackgroundColor('rgba(0,0,0,0.3)');

		this.add
			.text(this.game.config.width / 2, this.game.config.height / 2 - 110, 'GAME OVER', {
				fontSize: '48px',
				color: '#ff4444',
				fontStyle: 'bold',
				stroke: '#000000',
				strokeThickness: 4,
			})
			.setOrigin(0.5);

		const playAgainButton = this.add.image(
			this.game.config.width / 2,
			this.game.config.height / 2,
			'playagain'
		);
		playAgainButton.setScale(5);
		playAgainButton.setInteractive({ useHandCursor: true });
		this.playAgainButton = playAgainButton;

		playAgainButton.on('pointerdown', this.playAgain, this);

		playAgainButton.on('pointerover', () => {
			playAgainButton.setTint(0xcccccc);
		});
		playAgainButton.on('pointerout', () => {
			playAgainButton.clearTint();
		});
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
