import Enemy from './enemy.js';

export default class Ghost extends Enemy {
	constructor(scene, id) {
		const ghostOptions = {
			moveSpeed: 100,
			knockback: 0,
			wordCategory: 'veryEasy',
			dropTable: [
				{ itemType: 'SHIELD', chance: 1 },
				{ itemType: 'BOMB', chance: 1 },
			],
		};

		super(id, scene, 'ghost', ghostOptions);
	}
}
