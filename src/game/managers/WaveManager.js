import gameState from '../core/gameState';

export default class WaveManager {
	constructor(scene) {
		this.scene = scene;
		this.onWaveSpawnEnemy;
		this.onWaveSpawnItem;
	}

	calculateEnemyCounts() {
		const wave = gameState.getWave();
		const zombieCount = wave % 5 > 0 ? Math.max(2, 1 + wave) : 0;
		const ghostWaveMultiplier = Math.floor(wave / 5);
		const ghostCount = wave % 5 === 0 ? 6 + ghostWaveMultiplier : 0;
		const mummyCount = wave >= 7 && wave % 7 === 0 ? 1 + Math.floor(wave / 14) : 0;

		return { zombieCount, ghostCount, mummyCount };
	}

	calculateItemCounts() {
		const wave = gameState.getWave();

		let healthUp = wave % 10 === 0 ? 1 : 0;
		healthUp = 1;
		return { healthUp };
	}

	handleEnemiesSpawn() {
		const enemyCounts = this.calculateEnemyCounts();
		this.onWaveSpawnEnemy(enemyCounts);
	}

	handleItemSpawn() {
		const itemSpawns = this.calculateItemCounts();
		this.onWaveSpawnItem(itemSpawns);
	}

	onWaveComplete() {
		gameState.updateWave(gameState.getWave() + 1);
		this.handleEnemiesSpawn();
		this.handleItemSpawn();
	}

	startWaves(spawnHandlers) {
		this.onWaveSpawnEnemy = spawnHandlers.enemies;
		this.onWaveSpawnItem = spawnHandlers.items;
		this.handleEnemiesSpawn();
	}
}
