import Item from './item.js';

export default class Medkit extends Item {
	constructor(scene, x, y) {
		super(scene, x, y, 'MEDKIT');
	}
}