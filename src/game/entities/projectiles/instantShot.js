import Projectile from './projectile.js';

export default class InstantShot extends Projectile {
	constructor(scene, x, y) {
		super(scene, x, y, 'projectile', 1);

		this.speed = 6000;
		this.damageType = 'typing';
	}
}
