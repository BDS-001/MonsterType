import Enemy from './enemy.js';

export default class Mummy extends Enemy {
	constructor(scene, id) {
		const mummyOptions = {
			moveSpeed: 20,
			knockback: 20,
			wordCategory: 'hard',
			dropTable: [
				{ itemType: 'SHIELD', chance: 8 },
				{ itemType: 'RANDOM_WEAPON_DROP', chance: 6 },
				{ itemType: 'MEDKIT', chance: 4 },
				{ itemType: 'BOMB', chance: 2 },
			],
		};

		super(id, scene, 'mummy', mummyOptions);
	}
}
