import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';
import { shakeCamera } from '../util/cameraEffects.js';
import { spawnFloatingText } from '../util/floatingText.js';

export default class StateManager extends BaseManager {
	constructor(scene) {
		super(scene);

		this.resetState();
		this.setupEventListeners();
	}

	resetState() {
		this.state = {
			player: {
				maxHealth: 100,
				health: 100,
				immunity: false,
				immunityLength: 1000,
				shield: 0,
				maxShield: 30,
			},
			score: 0,
			gameOver: false,
		};
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.ENEMY_KILLED, this.handleEnemyKilled);
		this.subscribe(GAME_EVENTS.PLAYER_HIT, this.playerHit);
		this.subscribe(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged);
		this.subscribeGame(GAME_EVENTS.GAME_OVER, this.handleGameRestart);
	}

	handleEnemyKilled(data) {
		const { points } = data;
		this.updateScore(points);
	}

	handleHealthChanged(data) {
		if (data.maxHealthIncrease) {
			this.state.player.maxHealth += data.maxHealthIncrease;
			this.state.player.health += data.healthIncrease;
			this.emitGame(GAME_EVENTS.HEALTH_CHANGED, {
				...data,
				currentHealth: this.state.player.health,
				maxHealth: this.state.player.maxHealth,
			});

			if (data.healthIncrease > 0 && this.scene.player) {
				spawnFloatingText(
					this.scene,
					this.scene.player.x,
					this.scene.player.y - this.scene.player.displayHeight / 2 - 8,
					`+${Math.floor(data.healthIncrease)}`,
					'#4CAF50'
				);
			}
		}
	}

	updateScore(points) {
		this.state.score += points;
		this.emitGame(GAME_EVENTS.SCORE_CHANGED, { amount: points, newScore: this.state.score });
	}

	playerHit(data) {
		const { player, enemy } = data;
		if (this.state.player.immunity) return;

		const incomingDamage = typeof enemy?.damage === 'number' ? enemy.damage : 10;
		const shieldAbsorbed = Math.min(incomingDamage, this.state.player.shield);
		const trueDamage = incomingDamage - shieldAbsorbed;

		this.state.player.shield -= shieldAbsorbed;
		this.state.player.health = Math.max(0, this.state.player.health - trueDamage);

		this.state.player.immunity = true;
		this.scene.time.delayedCall(this.state.player.immunityLength, () => {
			this.state.player.immunity = false;
		});

		player?.playHitEffect(this.state.player.immunityLength);

		this.emitGame(GAME_EVENTS.SHIELD_CHANGED, { shield: this.state.player.shield });
		this.emitGame(GAME_EVENTS.PLAYER_HIT, {
			damage: trueDamage,
			immunityLength: this.state.player.immunityLength,
			currentHealth: this.state.player.health,
			maxHealth: this.state.player.maxHealth,
		});
		this.emitGame(GAME_EVENTS.HEALTH_CHANGED, {
			currentHealth: this.state.player.health,
			maxHealth: this.state.player.maxHealth,
		});

		if (trueDamage > 0) {
			shakeCamera(this.scene);
		}

		if (trueDamage > 0 && this.scene.player) {
			spawnFloatingText(
				this.scene,
				this.scene.player.x,
				this.scene.player.y - this.scene.player.displayHeight / 2 - 8,
				`-${Math.floor(trueDamage)}`,
				'#f44336'
			);
		}

		if (this.state.player.health <= 0) {
			this.handleGameOver();
		}
	}

	playerHeal(data) {
		const { amount } = data;
		this.state.player.health = Math.min(
			this.state.player.maxHealth,
			this.state.player.health + amount
		);
		this.emitGame(GAME_EVENTS.HEALTH_CHANGED, {
			currentHealth: this.state.player.health,
			maxHealth: this.state.player.maxHealth,
		});

		if (amount > 0 && this.scene.player) {
			spawnFloatingText(
				this.scene,
				this.scene.player.x,
				this.scene.player.y - this.scene.player.displayHeight / 2 - 8,
				`+${Math.floor(amount)}`,
				'#4CAF50'
			);
		}
	}

	handleGameOver() {
		this.state.gameOver = true;
		this.emitGame(GAME_EVENTS.GAME_OVER);
	}

	handleGameRestart(data) {
		if (data && data.reset) {
			this.resetState();
			this.emitGame(GAME_EVENTS.SHIELD_CHANGED, { shield: 0 });
		}
	}

	applyShield({ amount }) {
		this.state.player.shield = Math.min(
			this.state.player.maxShield,
			this.state.player.shield + amount
		);
		this.emitGame(GAME_EVENTS.SHIELD_CHANGED, { shield: this.state.player.shield });
		if (amount > 0 && this.scene.player) {
			spawnFloatingText(
				this.scene,
				this.scene.player.x,
				this.scene.player.y - this.scene.player.displayHeight / 2 - 8,
				`+${Math.floor(amount)}`,
				'#ffffff'
			);
		}
	}
}
