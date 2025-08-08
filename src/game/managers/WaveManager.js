export default class WaveManager {
	constructor(scene) {
		this.scene = scene;
		this.wave = 1;
		this.spawnEvent = null;
		this.onWaveSpawn;
	}

	calculateEnemyCounts() {
		const zombieCount = this.wave % 5 > 0 ? Math.max(2, 1 + this.wave) : 0;
		const ghostWaveMultiplier = Math.floor(this.wave / 5);
		const ghostCount = this.wave % 5 === 0 ? 6 + ghostWaveMultiplier : 0;
		const mummyCount = this.wave >= 7 && this.wave % 7 === 0 ? 1 + Math.floor(this.wave / 14) : 0;

		return { zombieCount, ghostCount, mummyCount };
	}

	handleEnemiesSpawn() {
		const enemyCounts = this.calculateEnemyCounts();
		this.onWaveSpawn(enemyCounts);
	}

	onWaveComplete() {
		this.wave += 1;
		this.handleEnemiesSpawn();
	}

	startWaves(waveDelay, onWaveSpawn) {
		if (this.spawnEvent) {
			return;
		}

		this.onWaveSpawn = onWaveSpawn;
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
