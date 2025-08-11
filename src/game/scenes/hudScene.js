import HealthBar from '../util/healthBar';
import fpsCounter from '../util/fpsCounter';
import { GAME_EVENTS } from '../core/GameEvents.js';

export class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene', active: true });

		this.scoreText = null;
		this.waveText = null;
		this.healthBar = null;
		this.healthText = null;
		this.fpsDisplay = null;

		// Game state tracking
		this.currentScore = 0;
		this.currentWave = 1;
		this.currentHealth = 100;
		this.maxHealth = 100;
	}
	create() {
		this.setupUI();
		this.setupEventListeners();
		this.healthBar = new HealthBar(
			this,
			85,
			this.game.config.height - 50,
			this.currentHealth,
			this.maxHealth
		);
		this.fpsDisplay = new fpsCounter(this);
	}

	setupUI() {
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

		this.scoreText = this.add.text(this.game.config.width / 2, 60, `Score: ${this.currentScore}`, {
			...textStyle,
			fontSize: '24px',
		});
		this.scoreText.setOrigin(0.5, 0);

		this.waveText = this.add.text(this.game.config.width / 2, 95, `Wave: ${this.currentWave}`, {
			...textStyle,
			fontSize: '20px',
		});
		this.waveText.setOrigin(0.5, 0);

		this.healthText = this.add.text(
			20,
			this.game.config.height - 80,
			`Health: ${this.currentHealth}`,
			{
				...textStyle,
				fontSize: '18px',
			}
		);
		this.healthText.setDepth(1000);
	}

	setupEventListeners() {
		this.game.events.on(GAME_EVENTS.SCORE_CHANGED, this.updateScore, this);
		this.game.events.on(GAME_EVENTS.WAVE_STARTED, this.updateWave, this);
		this.game.events.on(GAME_EVENTS.PLAYER_HIT, this.handlePlayerHit, this);
		this.game.events.on(GAME_EVENTS.PLAYER_HEALED, this.handlePlayerHealed, this);
		this.game.events.on(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged, this);
	}

	update() {
		this.fpsDisplay.updateFPS();
	}

	updateScore(data) {
		this.currentScore = data.newScore || this.currentScore + (data.amount || 0);
		this.scoreText.setText(`Score: ${this.currentScore}`);
	}

	updateWave(data) {
		this.currentWave = data.waveNumber;
		this.waveText.setText(`Wave: ${this.currentWave}`);
	}

	handlePlayerHit(data) {
		this.currentHealth -= data.damage;
		if (this.currentHealth < 0) this.currentHealth = 0;
		this.healthText.setText(`Health: ${this.currentHealth}`);
		this.healthBar.decrease(data.damage);
	}

	handlePlayerHealed(data) {
		this.currentHealth += data.amount;
		if (this.currentHealth > this.maxHealth) this.currentHealth = this.maxHealth;
		this.healthText.setText(`Health: ${this.currentHealth}`);
		this.healthBar.heal(data.amount);
	}

	handleHealthChanged(data) {
		if (data.maxHealthIncrease) {
			this.maxHealth += data.maxHealthIncrease;
			this.currentHealth += data.healthIncrease;
			this.healthText.setText(`Health: ${this.currentHealth}`);
			this.healthBar.increaseMax(data.maxHealthIncrease, data.healthIncrease);
		}
	}

	destroy() {
		this.game.events.off(GAME_EVENTS.SCORE_CHANGED, this.updateScore, this);
		this.game.events.off(GAME_EVENTS.WAVE_STARTED, this.updateWave, this);
		this.game.events.off(GAME_EVENTS.PLAYER_HIT, this.handlePlayerHit, this);
		this.game.events.off(GAME_EVENTS.PLAYER_HEALED, this.handlePlayerHealed, this);
		this.game.events.off(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged, this);
		super.destroy();
	}
}
