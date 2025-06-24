import Item from './item.js';

export default class HealthUp extends Item {
	constructor(scene, x, y) {
		super(scene, x, y, 'HEALTH_UP');
	}
}