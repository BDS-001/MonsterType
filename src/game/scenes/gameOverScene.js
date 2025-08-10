import { GAME_EVENTS } from '../core/GameEvents.js';

export class GameOver extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOver', active: true });
	}

	preload() {
		this.load.image('playagain', 'assets/playagain.png');
	}

	create() {
		this.scene.setVisible(false);
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
		playAgainButton.setInteractive();

		playAgainButton.on('pointerdown', this.playAgain, this);

		playAgainButton.on('pointerover', () => {
			playAgainButton.setTint(0xcccccc);
		});
		playAgainButton.on('pointerout', () => {
			playAgainButton.clearTint();
		});
	}

	playAgain() {
		const gameScene = this.scene.get('GameScene');
		if (gameScene) {
			gameScene.events.emit(GAME_EVENTS.GAME_OVER, { reset: true });
		}
		this.scene.setVisible(false);
		this.scene.start('GameScene');
	}
}
