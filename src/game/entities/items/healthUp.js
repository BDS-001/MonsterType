import Item from './item.js';

export default class HealthUp extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'HEALTH_UP', itemId, 'healthUp');
		this.healthIncreaseValue = this.baseValue;
	}

	onKill() {
		const player = this.scene.player;
		if (!player) throw new Error('Player not initialized');
		player.increaseMaxHealth(this.healthIncreaseValue, this.healthIncreaseValue);
	}
}
