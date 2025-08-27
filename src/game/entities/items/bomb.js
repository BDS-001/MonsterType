import Item from './item.js';

export default class Bomb extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'BOMB', itemId, 'bomb');
		this.damage = this.baseValue;
		this.radius = this.config.radius;
	}

	onKill() {
		const bodies = this.scene.physics.overlapCirc(this.x, this.y, this.radius, true, false);
		console.log(
			`Bomb exploded at (${this.x}, ${this.y}) with radius ${this.radius}, found ${bodies.length} bodies:`,
			bodies
		);
	}
}
