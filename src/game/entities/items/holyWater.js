import Item from './item.js';

export default class HolyWater extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'HOLY_WATER', itemId, 'medkit');
		this.shieldAmount = 5;
	}

	onKill() {
		const player = this.scene.player;
		if (!player) return;

		const healAmount = player.maxHealth - player.health;
		if (healAmount > 0) {
			this.scene.stateManager.playerHeal({ amount: healAmount });
		}

		player.applyShield(this.shieldAmount);
	}
}
