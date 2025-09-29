import Enemy from './enemy.js';

export default class Mummy extends Enemy {
	constructor(scene, x, y, id) {
		const mummyOptions = {
			moveSpeed: 30,
			knockback: 20,
			wordCategory: 'hard',
			dropTable: [
				{ itemType: 'SHIELD', chance: 8 },
				{ itemType: 'RANDOM_WEAPON_DROP', chance: 6 },
				{ itemType: 'MEDKIT', chance: 4 },
				{ itemType: 'BOMB', chance: 2 },
			],
		};

		super(scene, x, y, id, 'mummy', mummyOptions);
	}
}
