import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class InputManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.scene.input.keyboard.on('keydown', (event) => {
			const key = event.key.toLowerCase();
			if (key.length === 1 && key.match(/[a-z]/)) {
				this.emit(GAME_EVENTS.KEY_PRESSED, key);
			}
		});
	}
}
