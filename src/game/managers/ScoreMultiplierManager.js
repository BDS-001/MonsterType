import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

const BASE_COMBO_WINDOW_MS = 5000;
const MIN_COMBO_WINDOW_MS = 2000;
const WINDOW_DECREASE_PER_MILESTONE = 200;
const MILESTONE_INTERVAL = 5;
const MULTIPLIER_INCREMENT = 0.5;

export default class ScoreMultiplierManager extends BaseManager {
	constructor(scene) {
		super(scene);

		this.combo = 0;
		this.multiplier = 1;
		this.comboTimer = null;
		this.frozen = false;

		this.setupEventListeners();
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.ENEMY_KILLED, this.incrementCombo);
		this.subscribe(GAME_EVENTS.MULTIPLIER_BOOST_COLLECTED, this.handleBoostCollected);
		this.subscribeGame(GAME_EVENTS.GAME_OVER, this.handleGameRestart);
	}

	incrementCombo() {
		this.combo++;
		this.emit(GAME_EVENTS.COMBO_CHANGED, { combo: this.combo });
		this.updateMultiplier();
		this.resetComboTimer();
	}

	updateMultiplier() {
		const milestones = Math.floor(this.combo / MILESTONE_INTERVAL);
		this.multiplier = 1 + milestones * MULTIPLIER_INCREMENT;
		this.emitGame(GAME_EVENTS.MULTIPLIER_CHANGED, { multiplier: this.multiplier });
	}

	resetComboTimer() {
		if (this.comboTimer) {
			this.comboTimer.remove();
		}

		if (!this.frozen) {
			const comboWindow = this.getComboWindow();
			this.comboTimer = this.scene.time.delayedCall(comboWindow, () => {
				this.breakCombo();
			});
		}
	}

	getComboWindow() {
		const milestones = Math.floor(this.combo / MILESTONE_INTERVAL);
		const windowReduction = milestones * WINDOW_DECREASE_PER_MILESTONE;
		return Math.max(MIN_COMBO_WINDOW_MS, BASE_COMBO_WINDOW_MS - windowReduction);
	}

	breakCombo() {
		if (this.combo > 0) {
			this.emit(GAME_EVENTS.COMBO_BROKEN, { lastCombo: this.combo });
		}
		this.combo = 0;
		this.multiplier = 1;
		this.emit(GAME_EVENTS.COMBO_CHANGED, { combo: this.combo });
		this.emitGame(GAME_EVENTS.MULTIPLIER_CHANGED, { multiplier: this.multiplier });
	}

	handleBoostCollected(data) {
		const { boost, duration } = data;

		this.combo += Math.ceil(boost / MULTIPLIER_INCREMENT) * MILESTONE_INTERVAL;
		this.updateMultiplier();
		this.emit(GAME_EVENTS.COMBO_CHANGED, { combo: this.combo });

		this.frozen = true;
		if (this.comboTimer) {
			this.comboTimer.paused = true;
		}

		this.scene.time.delayedCall(duration, () => {
			this.frozen = false;
			if (this.comboTimer) {
				this.comboTimer.paused = false;
			}
		});
	}

	handleGameRestart(data) {
		if (data && data.reset) {
			this.reset();
		}
	}

	reset() {
		if (this.comboTimer) {
			this.comboTimer.remove();
			this.comboTimer = null;
		}
		this.combo = 0;
		this.multiplier = 1;
		this.frozen = false;
	}

	destroy() {
		if (this.comboTimer) {
			this.comboTimer.remove();
		}
		super.destroy();
	}
}
