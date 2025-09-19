import Enemy from './enemy.js';

export default class Zombie extends Enemy {
	constructor(scene, id) {
		const zombieOptions = {
			moveSpeed: 40,
			knockback: 40,
			wordCategory: 'easy',
			dropTable: [
				{ itemType: 'MEDKIT', chance: 5 },
				{ itemType: 'SHIELD', chance: 3 },
				{ itemType: 'RANDOM_WEAPON_DROP', chance: 4 },
				{ itemType: 'BOMB', chance: 3 },
			],
		};

		super(id, scene, 'zombie', zombieOptions);
	}
}
