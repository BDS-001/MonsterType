// basicShot.js
import Projectile from './projectile.js';

export default class BasicShot extends Projectile {
	constructor(scene, x, y) {
		super(scene, x, y, 'projectile', 1);
	}
}