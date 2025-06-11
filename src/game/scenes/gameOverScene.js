import gameState from '../core/gameState';

export class GameOver extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOver', active: true });
	}

	preload() {
		// Load game images
		this.load.image('playagain', 'assets/playagain.png');
	}

	create() {
		this.scene.setVisible(true);

		// transparent backround for the scene so i can still see gameplay
		this.cameras.main.setBackgroundColor('rgba(0,0,0,0.3)');

		// Center the game over text
		this.add
			.text(this.game.config.width / 2, this.game.config.width / 2 - 110, 'GAMEOVER', {
				fontSize: '48px',
				color: '#fff',
			})
			.setOrigin(0.5);

		// Add play again button
		const playAgainButton = this.add.image(
			this.game.config.width / 2,
			this.game.config.width / 2,
			'playagain'
		);
		playAgainButton.setScale(5);
		playAgainButton.setInteractive();
		playAgainButton.on('pointerdown', this.playAgain, this);
	}

	playAgain() {
		gameState.resetGameState();
		this.scene.setVisible(false);
		this.scene.start('GameScene');
	}
}
