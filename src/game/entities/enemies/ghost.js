// ghost.js
import Enemy from './enemy.js';

export default class Ghost extends Enemy {
    constructor(scene, id) {
        const ghostOptions = {
            moveSpeed: 100,
            knockback: 0
        };
        
        super(id, scene, 'ghost', 'veryEasy', ghostOptions);
    }
}