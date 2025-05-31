import gameState from '../core/gameState';

export class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene', active: true });
		this.scoreText = null;
	}
	create() {
		//dev text
		const devText = this.add.text(this.game.config.width / 2, 20, '🚧 GAME UNDER DEVELOPMENT 🚧', {
			fontSize: '24px',
			fontFamily: 'Arial, sans-serif',
			fill: '#ffffff',
			stroke: '#000000',
			strokeThickness: 2,
			fontStyle: 'bold',
		});
		devText.setOrigin(0.5, 0);

		//score text
		this.scoreText = this.add.text(
			this.game.config.width / 2,
			60,
			`Score: ${gameState.getScore()}`,
			{
				fontSize: '24px',
				fontFamily: 'Arial, sans-serif',
				fill: '#ffffff',
				stroke: '#000000',
				strokeThickness: 2,
				fontStyle: 'bold',
			}
		);
		this.scoreText.setOrigin(0.5, 0);
	}

	update() {
		this.scoreText.setText(`Score: ${gameState.getScore()}`);
	}
}
