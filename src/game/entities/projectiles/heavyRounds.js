// heavyRounds.js
import Projectile from './projectile.js';

export default class HeavyRounds extends Projectile {
	constructor(scene, x, y) {
		super(scene, x, y, 'projectile', 2);
	}
}
