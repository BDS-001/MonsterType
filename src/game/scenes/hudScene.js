import gameState from '../core/gameState';
import HealthBar from '../util/healthBar';

export class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene', active: true });
		this.scoreText = null;
		this.healthBar = null;
		this.healthText = null;
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

		// Health display in bottom-left corner
		this.healthText = this.add.text(20, this.game.config.height - 40, 'Health', {
			fontSize: '18px',
			fontFamily: 'Arial, sans-serif',
			fill: '#ffffff',
			stroke: '#000000',
			strokeThickness: 2,
			fontStyle: 'bold',
		});

		// Health bar positioned right next to the text
		this.healthBar = new HealthBar(this, 85, this.game.config.height - 50);
	}

	update() {
		this.scoreText.setText(`Score: ${gameState.getScore()}`);
	}

	decreaseHealth(amount) {
		return this.healthBar.decrease(amount);
	}
}
