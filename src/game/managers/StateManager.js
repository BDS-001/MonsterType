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
		this.subscribeGame(GAME_EVENTS.MULTIPLIER_CHANGED, this.handleMultiplierChanged);
		this.subscribeGame(GAME_EVENTS.GAME_OVER, this.handleGameRestart);
	}

	handleEnemyKilled(data) {
		const { points } = data;
		this.updateScore(points);
	}

	updateScore(points) {
		this.state.score += points * this.state.scoreMultiplier;
		this.emitGame(GAME_EVENTS.SCORE_CHANGED, { amount: points, newScore: this.state.score });
	}

	handleMultiplierChanged(data) {
		const { multiplier } = data;
		this.state.scoreMultiplier = multiplier;
	}

	playerHit(data) {
		const { enemy } = data;
		const player = this.scene.player;
		if (!player) throw new Error('Player not initialized');

		const damage = typeof enemy.baseStats.damage === 'number' ? enemy.baseStats.damage : 10;
		const trueDamage = player.takeDamage(damage, enemy) ?? 0;

		if (trueDamage > 0) {
			shakeCamera(this.scene);
		}
	}

	playerHeal(data) {
		const { amount } = data;
		const player = this.scene.player;
		if (!player) throw new Error('Player not initialized');
		player.heal(amount);
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
}
