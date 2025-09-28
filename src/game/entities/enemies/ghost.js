import Enemy from './enemy.js';

export default class Ghost extends Enemy {
	constructor(scene, x, y, id) {
		const ghostOptions = {
			moveSpeed: 100,
			knockback: 0,
			wordCategory: 'veryEasy',
			dropTable: [
				{ itemType: 'SHIELD', chance: 1 },
				{ itemType: 'BOMB', chance: 1 },
			],
		};

		super(scene, x, y, id, 'ghost', ghostOptions);
	}
}
