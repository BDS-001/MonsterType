import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';
import { shakeCamera } from '../util/cameraEffects.js';

export default class StateManager extends BaseManager {
	constructor(scene) {
		super(scene);

		this.resetState();
		this.setupEventListeners();
	}

	resetState() {
		this.state = {
			score: 0,
			scoreMultiplier: 1,
			gameOver: false,
		};
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.ENEMY_KILLED, this.handleEnemyKilled);
		this.subscribe(GAME_EVENTS.PLAYER_HIT, this.playerHit);
		this.subscribe(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged);
		this.subscribe(GAME_EVENTS.MULTIPLIER_REQUESTED, this.handleMultiplierRequested);
		this.subscribeGame(GAME_EVENTS.GAME_OVER, this.handleGameRestart);
	}

	handleEnemyKilled(data) {
		const { points } = data;
		this.updateScore(points);
	}

	handleHealthChanged(data) {
		if (data.maxHealthIncrease && this.scene.player) {
			this.scene.player.increaseMaxHealth(data.maxHealthIncrease, data.healthIncrease);
		}
	}

	updateScore(points) {
		this.state.score += points * this.state.scoreMultiplier;
		this.emitGame(GAME_EVENTS.SCORE_CHANGED, { amount: points, newScore: this.state.score });
	}

	handleMultiplierRequested(data) {
		const { multiplier } = data;
		this.updateScoreMultiplier(multiplier);
	}

	updateScoreMultiplier(multiplier) {
		this.state.scoreMultiplier = multiplier;
		this.emitGame(GAME_EVENTS.MULTIPLIER_CHANGED, { multiplier });
	}

	playerHit(data) {
		const { enemy } = data;
		if (!this.scene.player) return;

		const damage = typeof enemy?.baseStats?.damage === 'number' ? enemy.baseStats.damage : 10;
		const trueDamage = this.scene.player.takeDamage(damage, enemy);

		if (trueDamage > 0) {
			shakeCamera(this.scene);
		}
	}

	playerHeal(data) {
		const { amount } = data;
		if (!this.scene.player) return;

		this.scene.player.heal(amount);
	}

	handleGameOver() {
		this.state.gameOver = true;
	}

	handleGameRestart(data) {
		if (data && data.reset) {
			this.resetState();
			if (this.scene.player) {
				this.scene.player.reset();
			}
		}
	}

	applyShield({ amount }) {
		if (!this.scene.player) return;

		this.scene.player.applyShield(amount);
	}
}
