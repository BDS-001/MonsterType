import Phaser from 'phaser';
import { gameSettings } from '../core/constants';
import { GAME_EVENTS } from '../core/GameEvents';
import { spawnFloatingText } from '../util/floatingText';

export default class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'player');

		this.scene = scene;
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setScale(gameSettings.SPRITE_SCALE);
		this.maxHealth = 100;
		this.health = 100;
		this.shield = 0;
		this.maxShield = 30;
		this.immunity = false;
		this.immunityLength = 1000;
	}

	takeDamage(amount, source = null) {
		if (this.immunity) return;

		const incomingDamage = typeof amount === 'number' ? amount : 10;
		const shieldAbsorbed = Math.min(incomingDamage, this.shield);
		const trueDamage = incomingDamage - shieldAbsorbed;

		this.shield = Math.max(0, this.shield - shieldAbsorbed);
		this.health = Math.max(0, this.health - trueDamage);

		this.immunity = true;
		this.scene.time.delayedCall(this.immunityLength, () => {
			this.immunity = false;
		});

		this.playHitEffect(this.immunityLength);

		this.scene.events.emit(GAME_EVENTS.SHIELD_CHANGED, { shield: this.shield });
		this.scene.events.emit(GAME_EVENTS.PLAYER_HIT, {
			damage: trueDamage,
			immunityLength: this.immunityLength,
			currentHealth: this.health,
			maxHealth: this.maxHealth,
		});
		this.scene.events.emit(GAME_EVENTS.HEALTH_CHANGED, {
			currentHealth: this.health,
			maxHealth: this.maxHealth,
		});

		if (trueDamage > 0) {
			spawnFloatingText(
				this.scene,
				this.x,
				this.y - this.displayHeight / 2 - 8,
				`-${Math.floor(trueDamage)}`,
				'#f44336'
			);
		}

		if (this.health <= 0) {
			this.die();
		}

		return trueDamage;
	}

	heal(amount) {
		const healAmount = typeof amount === 'number' ? amount : 0;
		const oldHealth = this.health;
		this.health = Math.min(this.maxHealth, this.health + healAmount);
		const actualHeal = this.health - oldHealth;

		this.scene.events.emit(GAME_EVENTS.HEALTH_CHANGED, {
			currentHealth: this.health,
			maxHealth: this.maxHealth,
		});

		if (actualHeal > 0) {
			spawnFloatingText(
				this.scene,
				this.x,
				this.y - this.displayHeight / 2 - 8,
				`+${Math.floor(actualHeal)}`,
				'#4CAF50'
			);
		}

		return actualHeal;
	}

	applyShield(amount) {
		const shieldAmount = typeof amount === 'number' ? amount : 0;
		const oldShield = this.shield;
		this.shield = Math.min(this.maxShield, this.shield + shieldAmount);
		const actualShield = this.shield - oldShield;

		this.scene.events.emit(GAME_EVENTS.SHIELD_CHANGED, { shield: this.shield });

		if (actualShield > 0) {
			spawnFloatingText(
				this.scene,
				this.x,
				this.y - this.displayHeight / 2 - 8,
				`+${Math.floor(actualShield)}`,
				'#ffffff'
			);
		}

		return actualShield;
	}

	increaseMaxHealth(maxHealthIncrease, healthIncrease = 0) {
		this.maxHealth += maxHealthIncrease;
		this.health += healthIncrease;

		this.scene.events.emit(GAME_EVENTS.HEALTH_CHANGED, {
			maxHealthIncrease,
			healthIncrease,
			currentHealth: this.health,
			maxHealth: this.maxHealth,
		});

		if (healthIncrease > 0) {
			spawnFloatingText(
				this.scene,
				this.x,
				this.y - this.displayHeight / 2 - 8,
				`+${Math.floor(healthIncrease)}`,
				'#4CAF50'
			);
		}
	}

	die() {
		this.scene.events.emit(GAME_EVENTS.GAME_OVER);
	}

	reset() {
		this.health = 100;
		this.maxHealth = 100;
		this.shield = 0;
		this.immunity = false;
		this.setAlpha(1);
	}

	playHitEffect(immunityLength) {
		const flashDuration = 100;
		this.scene.tweens.add({
			targets: this,
			alpha: 0.3,
			duration: flashDuration,
			yoyo: true,
			repeat: Math.max(Math.floor(immunityLength / (flashDuration * 2)) - 1, 0),
			onComplete: () => this.setAlpha(1),
		});
	}
}
