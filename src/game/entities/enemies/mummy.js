// ghost.js
import Enemy from './enemy.js';

export default class Mummy extends Enemy {
	constructor(scene, id) {
		const ghostOptions = {
			moveSpeed: 20,
			knockback: 20,
			wordCategory: 'hard',
		};

		super(id, scene, 'mummy', ghostOptions);
	}
}
