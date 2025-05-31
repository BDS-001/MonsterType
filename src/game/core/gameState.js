//implement state management later
class GameState {
	constructor() {
		this.gameScene = null;
		this.player = { health: 100, immunity: false };
		this.score = 0;
	}

	playerHit(damage) {
		if (!this.gameScene) return;

		this.player.health -= damage;
		this.player.immunity = true;
		this.gameScene.time.delayedCall(1000, () => {
			this.player.immunity = false;
		});
	}

	updateScore(val) {
		this.score += val;
	}

	setGameScene(scene) {
		this.gameScene = scene;
	}

	getScore() {
		return this.score;
	}

	getPlayerImmunity() {
		return this.player.immunity;
	}
}

export default new GameState();
