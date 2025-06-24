import Item from './item.js';

export default class HeavyRoundsPickup extends Item {
	constructor(scene, x, y) {
		super(scene, x, y, 'HEAVYROUNDS_PICKUP');
	}
}