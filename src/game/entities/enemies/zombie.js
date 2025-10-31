import Enemy from './enemy.js';
import enemyConfig from '../../data/enemyConfig.json';

export default class Zombie extends Enemy {
	constructor(scene, x, y, id) {
		super(scene, x, y, id, 'zombie', enemyConfig.zombie);
	}
}
