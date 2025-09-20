import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class StateManager extends BaseManager {
	constructor(scene) {
		super(scene);

		this.resetState();
		this.setupEventListeners();
	}

	resetState() {
		if (this.shieldTimer) {
			this.shieldTimer.destroy();
			this.shieldTimer = null;
		}

		this.state = {
			player: {
				maxHealth: 100,
				health: 100,
				immunity: false,
				immunityLength: 1000,
				shield: 0,
			},
			score: 0,
			gameOver: false,
		};

		this.shieldTimer = null;
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.ENEMY_KILLED, this.handleEnemyKilled);
		this.subscribe(GAME_EVENTS.ITEM_COLLECTED, this.handleItemCollected);
		this.subscribe(GAME_EVENTS.PLAYER_HIT, this.playerHit);
		this.subscribe(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged);
		this.subscribeGame(GAME_EVENTS.GAME_OVER, this.handleGameRestart);
	}

	handleEnemyKilled(data) {
		const { points } = data;
		this.updateScore(points);
	}

	handleItemCollected(data) {
		const { points, item } = data;
		this.updateScore(points);
		if (item.type === 'health') {
			this.playerHeal({ amount: item.healAmount || 20 });
		}
	}

	handleHealthChanged(data) {
		if (data.maxHealthIncrease) {
			this.state.player.maxHealth += data.maxHealthIncrease;
			this.state.player.health += data.healthIncrease;
			this.emitGame(GAME_EVENTS.HEALTH_CHANGED, data);
		}
	}

	updateScore(points) {
		this.state.score += points;
		this.emit(GAME_EVENTS.SCORE_CHANGED, { amount: points, newScore: this.state.score });
		this.emitGame(GAME_EVENTS.SCORE_CHANGED, { amount: points, newScore: this.state.score });
	}

	playerHit(data) {
		const { damage, player } = data;
		if (this.state.player.immunity) return;

		const shieldAbsorbed = Math.min(damage, this.state.player.shield);
		const trueDamage = damage - shieldAbsorbed;

		this.state.player.shield -= shieldAbsorbed;
		this.state.player.health = Math.max(0, this.state.player.health - trueDamage);

		if (this.state.player.shield <= 0 && this.shieldTimer) {
			this.shieldTimer.destroy();
			this.shieldTimer = null;
		}

		this.state.player.immunity = true;
		this.scene.time.delayedCall(this.state.player.immunityLength, () => {
			this.state.player.immunity = false;
		});

		player?.playHitEffect(this.state.player.immunityLength);

		this.emitGame(GAME_EVENTS.SHIELD_CHANGED, { shield: this.state.player.shield });
		this.emit(GAME_EVENTS.PLAYER_HIT, {
			damage: trueDamage,
			immunityLength: this.state.player.immunityLength,
		});
		this.emitGame(GAME_EVENTS.PLAYER_HIT, {
			damage: trueDamage,
			immunityLength: this.state.player.immunityLength,
		});

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
		this.emit(GAME_EVENTS.PLAYER_HEALED, { amount });
		this.emitGame(GAME_EVENTS.PLAYER_HEALED, { amount });
	}

	handleGameOver() {
		this.state.gameOver = true;
		this.emit(GAME_EVENTS.GAME_OVER);
		this.emitGame(GAME_EVENTS.GAME_OVER);
	}

	handleGameRestart(data) {
		if (data && data.reset) {
			this.resetState();
			this.emitGame(GAME_EVENTS.SHIELD_CHANGED, { shield: 0 });
		}
	}

	applyShield({ amount, duration }) {
		if (this.shieldTimer) {
			this.shieldTimer.destroy();
		}

		this.state.player.shield = amount;
		this.emitGame(GAME_EVENTS.SHIELD_CHANGED, { shield: amount });

		this.shieldTimer = this.scene.time.delayedCall(duration, () => {
			this.state.player.shield = 0;
			this.shieldTimer = null;
			this.emitGame(GAME_EVENTS.SHIELD_CHANGED, { shield: 0 });
		});
	}
}
