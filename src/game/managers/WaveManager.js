import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

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

	calculateEnemyCounts(wave) {
		const zombieCount = wave % 5 > 0 ? Math.max(2, 1 + wave) : 0;
		const ghostWaveMultiplier = Math.floor(wave / 5);
		const ghostCount = wave % 5 === 0 ? 6 + ghostWaveMultiplier : 0;
		const mummyCount = wave >= 7 && wave % 7 === 0 ? 1 + Math.floor(wave / 14) : 0;

		return { zombieCount, ghostCount, mummyCount };
	}

	calculateItemCounts(wave) {
		let healthUpCount = wave % 10 === 0 ? 1 : 0;

		const itemCounts = {};
		if (healthUpCount > 0) itemCounts['HEALTH_UP'] = healthUpCount;

		return itemCounts;
	}

	startWave(waveNumber) {
		this.currentWave = waveNumber;
		this.enemiesAlive = 0;
		this.emit(GAME_EVENTS.WAVE_STARTED, { waveNumber: this.currentWave });
		this.emitGame(GAME_EVENTS.WAVE_STARTED, { waveNumber: this.currentWave });

		const enemyCounts = this.calculateEnemyCounts(this.currentWave);
		const itemCounts = this.calculateItemCounts(this.currentWave);

		this.emit(GAME_EVENTS.WAVE_SPAWN_ENEMIES, enemyCounts);
		this.emit(GAME_EVENTS.WAVE_SPAWN_ITEMS, itemCounts);
	}

	onWaveComplete() {
		this.emit(GAME_EVENTS.WAVE_COMPLETED, { waveNumber: this.currentWave });
		this.startWave(this.currentWave + 1);
	}

	startWaves() {
		this.startWave(1);
	}

	destroy() {
		super.destroy();
	}
}
