import gameState from '../core/gameState';

export default class WaveManager {
	constructor(scene) {
		this.scene = scene;
		this.spawnEvent = null;
		this.onWaveSpawnEnemy;
	}

	calculateEnemyCounts() {
		const wave = gameState.getWave();
		const zombieCount = wave % 5 > 0 ? Math.max(2, 1 + wave) : 0;
		const ghostWaveMultiplier = Math.floor(wave / 5);
		const ghostCount = wave % 5 === 0 ? 6 + ghostWaveMultiplier : 0;
		const mummyCount = wave >= 7 && wave % 7 === 0 ? 1 + Math.floor(wave / 14) : 0;

		return { zombieCount, ghostCount, mummyCount };
	}

	handleEnemiesSpawn() {
		const enemyCounts = this.calculateEnemyCounts();
		this.onWaveSpawnEnemy(enemyCounts);
	}

	handleItemSpawn() {
		return;
	}

	onWaveComplete() {
		gameState.updateWave(gameState.getWave() + 1);
		this.handleEnemiesSpawn();
		this.handleItemSpawn();
	}

	startWaves(onWaveSpawnEnemy) {
		if (this.spawnEvent) {
			return;
		}

		this.onWaveSpawnEnemy = onWaveSpawnEnemy;
		this.handleEnemiesSpawn();
	}

	stopWaves() {
		if (this.spawnEvent) {
			this.spawnEvent.remove();
			this.spawnEvent = null;
		}
	}

	destroy() {
		this.stopWaves();
	}
}
