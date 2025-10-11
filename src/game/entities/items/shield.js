import Item from './item.js';

export default class Shield extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'SHIELD', itemId, 'shield');
		this.shieldAmount = this.baseValue;
	}

	onKill() {
		const player = this.scene.player;
		if (!player) throw new Error('Player not initialized');
		player.applyShield(this.shieldAmount);
	}
}
