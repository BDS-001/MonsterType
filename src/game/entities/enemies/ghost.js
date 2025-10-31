import Enemy from './enemy.js';
import enemyConfig from '../../data/enemyConfig.json';

export default class Ghost extends Enemy {
	constructor(scene, x, y, id) {
		super(scene, x, y, id, 'ghost', enemyConfig.ghost);
	}
}
