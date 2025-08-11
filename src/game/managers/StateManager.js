import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class StateManager extends BaseManager {
	constructor(scene) {
		super(scene);

		this.state = {
			player: {
				maxHealth: 100,
				health: 100,
				immunity: false,
			},
			score: 0,
			wave: 1,
			gameOver: false,
		};

		this.setupEventListeners();
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.PROJECTILE_HIT, this.handleProjectileHit);
		this.subscribe(GAME_EVENTS.ENEMY_KILLED, this.handleEnemyKilled);
		this.subscribe(GAME_EVENTS.ITEM_COLLECTED, this.handleItemCollected);
		this.subscribe(GAME_EVENTS.PLAYER_HIT, this.handlePlayerHit);
		this.subscribe(GAME_EVENTS.PLAYER_HEALED, this.handlePlayerHealed);
		this.subscribe(GAME_EVENTS.HEALTH_CHANGED, this.handleHealthChanged);
		this.subscribe(GAME_EVENTS.WAVE_STARTED, this.handleWaveStarted);
	}

	handleProjectileHit(data) {
		const { points } = data;
		this.updateScore(points);
	}

	handleEnemyKilled(data) {
		const { points } = data;
		this.updateScore(points);
	}

	handleItemCollected(data) {
		const { points, item } = data;
		this.updateScore(points);
		if (item.type === 'health') {
			this.playerHeal(item.healAmount || 20);
		}
	}

	handlePlayerHit(data) {
		const { damage } = data;
		this.playerHit(damage);
	}

	handlePlayerHealed(data) {
		const { amount } = data;
		this.state.player.health = Math.min(
			this.state.player.maxHealth,
			this.state.player.health + amount
		);
	}

	handleWaveStarted(data) {
		const { waveNumber } = data;
		this.updateWave(waveNumber);
	}

	handleHealthChanged(data) {
		if (data.maxHealthIncrease) {
			this.state.player.maxHealth += data.maxHealthIncrease;
			this.state.player.health += data.healthIncrease;
		}
	}

	updateScore(points) {
		this.state.score += points;
		this.emit(GAME_EVENTS.SCORE_CHANGED, { amount: points, newScore: this.state.score });
		this.emitGame(GAME_EVENTS.SCORE_CHANGED, { amount: points, newScore: this.state.score });
	}

	playerHit(damage) {
		if (this.state.player.immunity) return;

		this.state.player.health = Math.max(0, this.state.player.health - damage);
		this.state.player.immunity = true;

		this.scene.time.delayedCall(1000, () => {
			this.state.player.immunity = false;
		});

		this.emit(GAME_EVENTS.PLAYER_HIT, { damage });
		this.emitGame(GAME_EVENTS.PLAYER_HIT, { damage });

		if (this.state.player.health <= 0) {
			this.handleGameOver();
		}
	}

	playerHeal(healAmount) {
		this.state.player.health = Math.min(
			this.state.player.maxHealth,
			this.state.player.health + healAmount
		);
		this.emit(GAME_EVENTS.PLAYER_HEALED, { amount: healAmount });
		this.emitGame(GAME_EVENTS.PLAYER_HEALED, { amount: healAmount });
	}

	handleGameOver() {
		this.state.gameOver = true;
		this.emit(GAME_EVENTS.GAME_OVER);
		this.emitGame(GAME_EVENTS.GAME_OVER);
	}

	updateWave(waveNumber) {
		this.state.wave = waveNumber;
	}

	getPlayerImmunity() {
		return this.state.player.immunity;
	}
}
