class GameState {
	constructor() {
		this.resetGameState();
	}

	resetGameState() {
		this.gameScene = null;
		this.player = {
			maxHealth: 100,
			health: 100,
			immunity: false,
		};
		this.score = 0;
		this.gameOver = false;
	}

	toggleGameOver() {
		this.gameOver = !this.gameOver;
	}

	increaseHealth(amount) {
		this.player.maxHealth += amount;
		this.player.health += amount;
	}

	playerHeal(healAmount) {
		if (!this.gameScene) return;

		this.player.health += healAmount;
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
