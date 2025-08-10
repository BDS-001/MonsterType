import gameState from '../core/gameState';
import HealthBar from '../util/healthBar';
import fpsCounter from '../util/fpsCounter';

export class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene', active: true });

		this.scoreText = null;
		this.waveText = null;
		this.healthBar = null;
		this.healthText = null;
		this.fpsDisplay = null;
	}
	create() {
		const textStyle = {
			fontFamily: 'Arial, sans-serif',
			fill: '#ffffff',
			stroke: '#000000',
			strokeThickness: 2,
			fontStyle: 'bold',
		};

		const devText = this.add.text(this.game.config.width / 2, 20, '🚧 GAME UNDER DEVELOPMENT 🚧', {
			...textStyle,
			fontSize: '24px',
		});
		devText.setOrigin(0.5, 0);

		this.scoreText = this.add.text(
			this.game.config.width / 2,
			60,
			`Score: ${gameState.getScore()}`,
			{
				...textStyle,
				fontSize: '24px',
			}
		);
		this.scoreText.setOrigin(0.5, 0);

		this.waveText = this.add.text(this.game.config.width / 2, 95, `Wave: ${gameState.getWave()}`, {
			...textStyle,
			fontSize: '20px',
		});
		this.waveText.setOrigin(0.5, 0);

		this.healthText = this.add.text(
			20,
			this.game.config.height - 80,
			`Health: ${gameState.player.health}`,
			{
				...textStyle,
				fontSize: '18px',
			}
		);
		this.healthText.setDepth(1000);

		this.healthBar = new HealthBar(this, 85, this.game.config.height - 50);
		this.fpsDisplay = new fpsCounter(this);
	}

	update() {
		this.scoreText.setText(`Score: ${gameState.getScore()}`);
		this.waveText.setText(`Wave: ${gameState.getWave()}`);
		this.healthText.setText(`Health: ${gameState.player.health}`);
		this.fpsDisplay.updateFPS();
	}

	decreaseHealth(amount) {
		return this.healthBar.decrease(amount);
	}
}
