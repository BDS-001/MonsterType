import Item from './item.js';

export default class Bomb extends Item {
	constructor(scene, x, y) {
		super(scene, x, y, 'BOMB');
	}
}