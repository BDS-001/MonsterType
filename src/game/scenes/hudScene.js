import HealthBar from '../util/healthBar';
import fpsCounter from '../util/fpsCounter';
import { GAME_EVENTS } from '../core/GameEvents.js';
import { TEXT_STYLES } from '../config/fontConfig.js';

export class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene', active: true });

		this.uiElements = {};
		this.healthBar = null;
		this.fpsDisplay = null;

		this.currentScore = 0;
		this.currentWave = 1;
		this.currentWeapon = 'Basic Rifle';
		this.currentAmmo = null;
		this.currentMaxAmmo = null;
		this.INITIAL_HEALTH = 100;
		this.PADDING = 20;
	}
	create() {
		this.setupUI();
		this.setupEventListeners();

		const { width, height } = this.game.config;

		this.healthBar = new HealthBar(
			this,
			this.PADDING,
			height - this.PADDING - 15,
			this.INITIAL_HEALTH,
			this.INITIAL_HEALTH
		);

		this.uiElements.healthValueText = this.add
			.text(
				this.healthBar.x + this.healthBar.width / 2,
				this.healthBar.y + this.healthBar.height / 2,
				`${this.INITIAL_HEALTH}/${this.INITIAL_HEALTH}`,
				TEXT_STYLES.UI_SMALL
			)
			.setOrigin(0.5, 0.5)
			.setDepth(1000);

		this.uiElements.shieldText = this.add
			.text(this.healthBar.x, this.healthBar.y - 8, 'Shield: 0', TEXT_STYLES.UI_SMALL)
			.setOrigin(0, 1)
			.setDepth(1000)
			.setVisible(false);

		this.fpsDisplay = new fpsCounter(this);
		this.fpsDisplay.setOrigin(1, 0);
		this.fpsDisplay.setPosition(width - this.PADDING, this.PADDING);

		this.updateHealthText();
	}

	setupUI() {
		const { width, height } = this.game.config;

		this.uiElements.devBadge = this.add
			.text(this.PADDING, this.PADDING, 'GAME IS WORK IN PROGRESS', TEXT_STYLES.UI_TINY)
			.setOrigin(0, 0)
			.setAlpha(0.9);

		const waveY = this.uiElements.devBadge.y + this.uiElements.devBadge.height + 6;
		this.uiElements.waveText = this.add
			.text(this.PADDING, waveY, `Wave: ${this.currentWave}`, TEXT_STYLES.UI_SMALL)
			.setOrigin(0, 0);

		this.uiElements.scoreText = this.add
			.text(width / 2, this.PADDING, `Score: ${this.currentScore}`, TEXT_STYLES.UI_MEDIUM)
			.setOrigin(0.5, 0);

		this.uiElements.weaponAmmoText = this.add
			.text(width - this.PADDING, height - this.PADDING, '', TEXT_STYLES.UI_SMALL)
			.setOrigin(1, 1);
		this.renderWeaponAmmoText();

		this.cameras.main.roundPixels = true;
	}

	setupEventListeners() {
		this.game.events.on(GAME_EVENTS.SCORE_CHANGED, this.updateScore, this);
		this.game.events.on(GAME_EVENTS.WAVE_STARTED, this.updateWave, this);
		this.game.events.on(GAME_EVENTS.WEAPON_EQUIPPED, this.updateWeapon, this);
		this.game.events.on(GAME_EVENTS.WEAPON_AMMO_CHANGED, this.updateAmmo, this);
		this.game.events.on(GAME_EVENTS.PLAYER_HIT, this.handlePlayerHit, this);
		this.game.events.on(GAME_EVENTS.PLAYER_HEALED, this.handlePlayerHealed, this);
		this.game.events.on(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged, this);
		this.game.events.on(GAME_EVENTS.SHIELD_CHANGED, this.updateShield, this);
		this.game.events.on(GAME_EVENTS.GAME_OVER, this.handleGameRestart, this);
	}

	update() {
		this.fpsDisplay.updateFPS();
	}

	updateScore(data) {
		this.currentScore = data.newScore || this.currentScore + (data.amount || 0);
		this.renderScoreText();
	}

	updateWave(data) {
		this.currentWave = data.waveNumber;
		this.renderWaveText();
	}

	updateWeapon(data) {
		this.currentWeapon = data.weapon.name;
		this.renderWeaponAmmoText();
	}

	handlePlayerHit(data) {
		this.updateHealthText();
	}

	handlePlayerHealed(data) {
		this.showHealNumber(data.amount);
	}

	handleHealthChanged(data) {
		if (data && typeof data.currentHealth === 'number') {
			if (typeof data.maxHealth === 'number' && data.maxHealth !== this.healthBar.maxValue) {
				this.healthBar.maxValue = data.maxHealth;
				this.healthBar.p =
					(this.healthBar.width - this.healthBar.borderThickness * 2) / this.healthBar.maxValue;
			}
			this.healthBar.setValue(data.currentHealth);
			this.updateHealthText();
			if (typeof data.healthIncrease === 'number' && data.healthIncrease > 0) {
				this.showHealNumber(data.healthIncrease);
			}
			return;
		}

		if (data?.maxHealthIncrease) {
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

	updateAmmo(data) {
		const { ammo, maxAmmo } = data;
		this.currentAmmo = ammo;
		this.currentMaxAmmo = maxAmmo;
		this.renderWeaponAmmoText();
	}

	updateShield(data) {
		const { shield } = data;
		this.uiElements.shieldText.setText(`Shield: ${shield}`);
		this.uiElements.shieldText.setVisible(shield > 0);
	}

	updateHealthText() {
		const currentHealth = Math.floor(this.healthBar.value);
		const maxHealth = Math.floor(this.healthBar.maxValue);
		const centerX = this.healthBar.x + this.healthBar.width / 2;
		const centerY = this.healthBar.y + this.healthBar.height / 2;
		this.uiElements.healthValueText?.setText(`${currentHealth}/${maxHealth}`);
		this.uiElements.healthValueText?.setPosition(centerX, centerY);
	}

	handleGameRestart(data) {
		if (data && data.reset) {
			this.healthBar.resetToFull();
			this.updateHealthText();
			this.currentScore = 0;
			this.currentWave = 1;
			this.currentAmmo = null;
			this.currentMaxAmmo = null;
			this.renderScoreText();
			this.renderWaveText();
			this.renderWeaponAmmoText();
			this.uiElements.shieldText.setVisible(false);
		}
	}

	renderScoreText() {
		this.uiElements.scoreText?.setText(`Score: ${this.currentScore}`);
	}

	renderWaveText() {
		this.uiElements.waveText?.setText(`Wave: ${this.currentWave}`);
	}

	renderWeaponAmmoText() {
		let ammoText = '';
		if (this.currentMaxAmmo === -1) {
			ammoText = ' · Ammo: ∞';
		} else if (
			this.currentAmmo !== null &&
			this.currentAmmo !== undefined &&
			this.currentMaxAmmo !== null &&
			this.currentMaxAmmo !== undefined
		) {
			ammoText = ` · Ammo: ${this.currentAmmo}/${this.currentMaxAmmo}`;
		}
		this.uiElements.weaponAmmoText?.setText(`Weapon: ${this.currentWeapon}${ammoText}`);
	}

	destroy() {
		this.game.events.off(GAME_EVENTS.SCORE_CHANGED, this.updateScore, this);
		this.game.events.off(GAME_EVENTS.WAVE_STARTED, this.updateWave, this);
		this.game.events.off(GAME_EVENTS.WEAPON_EQUIPPED, this.updateWeapon, this);
		this.game.events.off(GAME_EVENTS.WEAPON_AMMO_CHANGED, this.updateAmmo, this);
		this.game.events.off(GAME_EVENTS.PLAYER_HIT, this.handlePlayerHit, this);
		this.game.events.off(GAME_EVENTS.PLAYER_HEALED, this.handlePlayerHealed, this);
		this.game.events.off(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged, this);
		this.game.events.off(GAME_EVENTS.SHIELD_CHANGED, this.updateShield, this);
		this.game.events.off(GAME_EVENTS.GAME_OVER, this.handleGameRestart, this);
		super.destroy();
	}
}
