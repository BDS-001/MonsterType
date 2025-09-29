import HealthBar from '../util/healthBar';
import fpsCounter from '../util/fpsCounter';
import { GAME_EVENTS } from '../core/GameEvents.js';
import { TEXT_STYLES } from '../config/fontConfig.js';
import { spawnFloatingText } from '../util/floatingText.js';
import { applyTextShadow } from '../util/textEffects.js';

export class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene' });

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
		applyTextShadow(this.uiElements.healthValueText);

		this.uiElements.shieldText = this.add
			.text(this.healthBar.x, this.healthBar.y - 8, 'Shield: 0', TEXT_STYLES.UI_SMALL)
			.setOrigin(0, 1)
			.setDepth(1000)
			.setVisible(false);
		applyTextShadow(this.uiElements.shieldText);

		this.fpsDisplay = new fpsCounter(this);
		this.fpsDisplay.setOrigin(1, 0);
		this.fpsDisplay.setPosition(width - this.PADDING, this.PADDING);

		this.updateHealthText();
	}

	setupUI() {
		const { width, height } = this.game.config;

		this.uiElements.waveText = this.add
			.text(this.PADDING, this.PADDING, `Wave: ${this.currentWave}`, TEXT_STYLES.UI_SMALL)
			.setOrigin(0, 0);
		applyTextShadow(this.uiElements.waveText);

		this.uiElements.scoreText = this.add
			.text(width / 2, this.PADDING, `Score: ${this.currentScore}`, TEXT_STYLES.UI_MEDIUM)
			.setOrigin(0.5, 0);
		applyTextShadow(this.uiElements.scoreText);

		this.uiElements.weaponAmmoText = this.add
			.text(width - this.PADDING, height - this.PADDING, '', TEXT_STYLES.UI_SMALL)
			.setOrigin(1, 1);
		this.renderWeaponAmmoText();
		applyTextShadow(this.uiElements.weaponAmmoText);

		this.cameras.main.roundPixels = true;
	}

	setupEventListeners() {
		this.game.events.on(GAME_EVENTS.SCORE_CHANGED, this.updateScore, this);
		this.game.events.on(GAME_EVENTS.WAVE_STARTED, this.updateWave, this);
		this.game.events.on(GAME_EVENTS.WEAPON_EQUIPPED, this.updateWeapon, this);
		this.game.events.on(GAME_EVENTS.WEAPON_AMMO_CHANGED, this.updateAmmo, this);
		this.game.events.on(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged, this);
		this.game.events.on(GAME_EVENTS.SHIELD_CHANGED, this.updateShield, this);
		this.game.events.on(GAME_EVENTS.GAME_OVER, this.handleGameRestart, this);
	}

	update() {
		this.fpsDisplay.updateFPS();
	}

	updateScore(data) {
		const added = data?.amount || 0;
		this.currentScore = data.newScore || this.currentScore + added;
		this.renderScoreText();

		if (added > 0 && this.uiElements.scoreText) {
			const x = this.uiElements.scoreText.x;
			const y = this.uiElements.scoreText.y + this.uiElements.scoreText.height + 8;
			spawnFloatingText(this, x, y, `+${added}`, '#ffd54f');
			this.pulseText(this.uiElements.scoreText, 1.12, 140);
		}
	}

	updateWave(data) {
		this.currentWave = data.waveNumber;
		this.renderWaveText();
		this.showWaveBanner(this.currentWave);
	}

	updateWeapon(data) {
		this.currentWeapon = data.weapon.name;
		this.renderWeaponAmmoText();
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

			return;
		}

		if (data?.maxHealthIncrease) {
			this.healthBar.increaseMax(data.maxHealthIncrease, data.healthIncrease);
			this.updateHealthText();
		}
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

	pulseText(target, scaleTo = 1.12, duration = 140) {
		if (!target) return;
		this.tweens.add({
			targets: target,
			scaleX: scaleTo,
			scaleY: scaleTo,
			duration,
			yoyo: true,
			ease: 'Sine.easeOut',
		});
	}

	showWaveBanner(waveNumber) {
		const { width } = this.game.config;
		this.uiElements.waveBanner?.destroy();

		const finalY =
			(this.uiElements.scoreText?.y || this.PADDING) +
			(this.uiElements.scoreText?.height || 0) +
			12;
		const text = this.add
			.text(width / 2, finalY - 30, `Wave ${waveNumber}`, TEXT_STYLES.UI_MEDIUM)
			.setOrigin(0.5, 0)
			.setDepth(3000)
			.setAlpha(0);

		applyTextShadow(text);
		this.uiElements.waveBanner = text;

		this.tweens.add({
			targets: text,
			y: finalY,
			alpha: 1,
			duration: 200,
			ease: 'Back.Out',
			onComplete: () => {
				this.time.delayedCall(600, () => {
					this.tweens.add({
						targets: text,
						y: text.y - 20,
						alpha: 0,
						duration: 250,
						ease: 'Sine.easeIn',
						onComplete: () => text.destroy(),
					});
				});
			},
		});
	}

	destroy() {
		this.game.events.off(GAME_EVENTS.SCORE_CHANGED, this.updateScore, this);
		this.game.events.off(GAME_EVENTS.WAVE_STARTED, this.updateWave, this);
		this.game.events.off(GAME_EVENTS.WEAPON_EQUIPPED, this.updateWeapon, this);
		this.game.events.off(GAME_EVENTS.WEAPON_AMMO_CHANGED, this.updateAmmo, this);
		this.game.events.off(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged, this);
		this.game.events.off(GAME_EVENTS.SHIELD_CHANGED, this.updateShield, this);
		this.game.events.off(GAME_EVENTS.GAME_OVER, this.handleGameRestart, this);
		super.destroy();
	}
}
