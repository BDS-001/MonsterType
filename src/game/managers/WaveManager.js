import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';
import waves from '../data/waves.json';

export default class WaveManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.currentWave = 1;
		this.enemiesAlive = 0;
		this.setupEventListeners();
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.ENEMY_SPAWNED, this.handleEnemySpawned);
		this.subscribe(GAME_EVENTS.ENEMY_KILLED, this.handleEnemyKilled);
	}

	handleEnemySpawned() {
		this.enemiesAlive++;
	}

	handleEnemyKilled() {
		this.enemiesAlive--;
		if (this.enemiesAlive <= 0) {
			this.onWaveComplete();
		}
	}

	startWave(waveNumber) {
		this.currentWave = waveNumber;
		this.enemiesAlive = 0;
		this.emitGame(GAME_EVENTS.WAVE_STARTED, { waveNumber: this.currentWave });

		const waveDef = waves.find((w) => w.wave === this.currentWave);
		const enemySpawns = waveDef?.enemies ?? [];
		const itemSpawns = waveDef?.items ?? [];

		this.emit(GAME_EVENTS.WAVE_SPAWN_ENEMIES, enemySpawns);
		this.emit(GAME_EVENTS.WAVE_SPAWN_ITEMS, itemSpawns);
	}

	onWaveComplete() {
		const next = this.currentWave + 1;
		const hasNext = (waves || []).some((w) => w.wave === next);
		if (hasNext) {
			this.startWave(next);
		} else {
			// No further waves defined; stay on current or implement loop logic
			// Optionally emit an event here for end-of-waves
		}
	}

	startWaves() {
		this.startWave(1);
	}

	destroy() {
		super.destroy();
	}
}
