//implement state management later
class GameState {
	constructor() {
		this.gameScene = null;
		this.player = { health: 100, immunity: false };
	}

	playerHit(damage) {
		if (!this.gameScene) return;

		this.player.health -= damage;
		this.player.immunity = true;
		this.gameScene.time.delayedCall(1000, () => {
			this.player.immunity = false;
		});
	}

	setGameScene(scene) {
		this.gameScene = scene;
	}

	getPlayerImmunity() {
		return this.player.immunity;
	}
}

export default new GameState();
