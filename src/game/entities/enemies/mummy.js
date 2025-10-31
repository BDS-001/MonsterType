import Enemy from './enemy.js';
import enemyConfig from '../../data/enemyConfig.json';

export default class Mummy extends Enemy {
	constructor(scene, x, y, id) {
		super(scene, x, y, id, 'mummy', enemyConfig.mummy);
	}
}
