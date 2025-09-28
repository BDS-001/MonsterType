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

	getWaveData(wave) {
		const configWave = waves[wave];
		return (
			configWave ?? {
				enemies: this.calculateDynamicEnemies(wave),
				items: this.calculateDynamicItems(wave),
			}
		);
	}

	calculateDynamicEnemies(wave) {
		const zombieCount = Math.max(20, Math.floor(wave * 1.5));
		const ghostCount = Math.max(10, Math.floor(wave * 0.6));
		const mummyCount = Math.max(3, Math.floor(wave * 0.25));
		const slimeCount = Math.max(1, Math.floor(wave * 0.1));

		return {
			zombie: { count: zombieCount },
			ghost: { count: ghostCount },
			mummy: { count: mummyCount },
			slime: { count: slimeCount },
		};
	}

	calculateDynamicItems(wave) {
		const healthUpCount = wave % 10 === 0 ? Math.min(3, Math.floor(wave / 20)) : 0;

		const items = {};
		if (healthUpCount > 0) items.HEALTH_UP = healthUpCount;

		return items;
	}

	startWave(waveNumber) {
		this.currentWave = waveNumber;
		this.enemiesAlive = 0;
		this.emitGame(GAME_EVENTS.WAVE_STARTED, { waveNumber: this.currentWave });

		const waveData = this.getWaveData(this.currentWave);

		this.emit(GAME_EVENTS.SPAWN_ENEMIES, waveData.enemies);
		this.emit(GAME_EVENTS.WAVE_SPAWN_ITEMS, waveData.items);
	}

	onWaveComplete() {
		this.startWave(this.currentWave + 1);
	}

	startWaves() {
		this.startWave(1);
	}

	destroy() {
		super.destroy();
	}
}
