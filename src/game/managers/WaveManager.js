export default class WaveManager {
	constructor(scene) {
		this.scene = scene;
		this.wave = 1;
		this.currentTime = 0;
		this.spawnEvent = null;
	}

	calculateEnemyCounts() {
		const zombieCount = this.wave % 5 > 0 ? Math.max(2, 1 + this.wave) : 0;
		const ghostWaveMultiplier = Math.floor(this.wave / 5);
		const ghostCount = this.wave % 5 === 0 ? 6 + ghostWaveMultiplier : 0;
		const mummyCount = this.wave >= 7 && this.wave % 7 === 0 ? 1 + Math.floor(this.wave / 14) : 0;

		return { zombieCount, ghostCount, mummyCount };
	}

	onWaveComplete() {
		this.wave += 1;
	}

	startWaves(initialWaveDelay = 5000, onWaveSpawn) {
		if (this.spawnEvent) {
			return;
		}

		this.spawnEvent = this.scene.time.addEvent({
			delay: initialWaveDelay,
			callback: () => {
				const enemyCounts = this.calculateEnemyCounts();
				onWaveSpawn(enemyCounts);
				this.onWaveComplete();
			},
			callbackScope: this,
			loop: true,
		});
	}

	stopWaves() {
		if (this.spawnEvent) {
			this.spawnEvent.remove();
			this.spawnEvent = null;
		}
	}

	update(time) {
		this.currentTime = time;
	}

	destroy() {
		this.stopWaves();
	}
}
