import HealthBar from '../util/healthBar';
import fpsCounter from '../util/fpsCounter';
import { GAME_EVENTS } from '../core/GameEvents.js';
import { TEXT_STYLES } from '../config/fontConfig.js';

export class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene', active: true });

		this.scoreText = null;
		this.waveText = null;
		this.weaponText = null;
		this.healthBar = null;
		this.healthText = null;
		this.fpsDisplay = null;

		this.currentScore = 0;
		this.currentWave = 1;
		this.currentWeapon = 'Basic Rifle';

		this.HEALTH_BAR_X = 85;
		this.HEALTH_BAR_Y_OFFSET = 50;
		this.HEALTH_TEXT_Y_OFFSET = 80;
		this.INITIAL_HEALTH = 100;
	}
	create() {
		this.setupUI();
		this.setupEventListeners();

		this.healthBar = new HealthBar(
			this,
			this.HEALTH_BAR_X,
			this.game.config.height - this.HEALTH_BAR_Y_OFFSET,
			this.INITIAL_HEALTH,
			this.INITIAL_HEALTH
		);
		this.fpsDisplay = new fpsCounter(this);
		this.updateHealthText();
	}

	setupUI() {
		const devText = this.add.text(
			this.game.config.width / 2,
			20,
			'🚧 GAME UNDER DEVELOPMENT 🚧',
			TEXT_STYLES.UI_MEDIUM
		);
		devText.setOrigin(0.5, 0);

		this.scoreText = this.add.text(
			this.game.config.width / 2,
			60,
			`Score: ${this.currentScore}`,
			TEXT_STYLES.UI_MEDIUM
		);
		this.scoreText.setOrigin(0.5, 0);

		this.waveText = this.add.text(
			this.game.config.width / 2,
			95,
			`Wave: ${this.currentWave}`,
			TEXT_STYLES.UI_SMALL
		);
		this.waveText.setOrigin(0.5, 0);

		this.weaponText = this.add.text(
			this.game.config.width / 2,
			125,
			`Weapon: ${this.currentWeapon}`,
			TEXT_STYLES.UI_TINY
		);
		this.weaponText.setOrigin(0.5, 0);

		this.healthText = this.add.text(
			this.HEALTH_BAR_X,
			this.game.config.height - this.HEALTH_TEXT_Y_OFFSET,
			`${this.INITIAL_HEALTH}/${this.INITIAL_HEALTH}`,
			TEXT_STYLES.UI_SMALL
		);
		this.healthText.setDepth(1000);
		this.cameras.main.roundPixels = true;
	}

	setupEventListeners() {
		this.game.events.on(GAME_EVENTS.SCORE_CHANGED, this.updateScore, this);
		this.game.events.on(GAME_EVENTS.WAVE_STARTED, this.updateWave, this);
		this.game.events.on(GAME_EVENTS.WEAPON_EQUIPPED, this.updateWeapon, this);
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

	updateWeapon(data) {
		this.currentWeapon = data.weapon.name;
		this.weaponText.setText(`Weapon: ${this.currentWeapon}`);
	}

	handlePlayerHit(data) {
		this.healthBar.decrease(data.damage);
		this.updateHealthText();
	}

	handlePlayerHealed(data) {
		this.healthBar.heal(data.amount);
		this.updateHealthText();
		this.showHealNumber(data.amount);
	}

	handleHealthChanged(data) {
		if (data.maxHealthIncrease) {
			this.healthBar.increaseMax(data.maxHealthIncrease, data.healthIncrease);
			this.updateHealthText();
			this.showHealNumber(data.healthIncrease);
		}
	}

	showHealNumber(amount) {
		const healText = this.add.text(
			this.healthBar.x + this.healthBar.width / 2,
			this.healthBar.y - 10,
			`+${amount}`,
			{ ...TEXT_STYLES.UI_SMALL, fill: '#4CAF50' }
		);

		healText.setOrigin(0.5, 1);
		healText.setDepth(2000);

		this.tweens.add({
			targets: healText,
			y: healText.y - 40,
			alpha: 0,
			scale: 1.2,
			duration: 1200,
			ease: 'Power2',
			onComplete: () => {
				healText.destroy();
			},
		});
	}

	updateHealthText() {
		const currentHealth = Math.floor(this.healthBar.value);
		const maxHealth = Math.floor(this.healthBar.maxValue);
		this.healthText.setText(`${currentHealth}/${maxHealth}`);
	}

	destroy() {
		this.game.events.off(GAME_EVENTS.SCORE_CHANGED, this.updateScore, this);
		this.game.events.off(GAME_EVENTS.WAVE_STARTED, this.updateWave, this);
		this.game.events.off(GAME_EVENTS.WEAPON_EQUIPPED, this.updateWeapon, this);
		this.game.events.off(GAME_EVENTS.PLAYER_HIT, this.handlePlayerHit, this);
		this.game.events.off(GAME_EVENTS.PLAYER_HEALED, this.handlePlayerHealed, this);
		this.game.events.off(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged, this);
		super.destroy();
	}
}
