import { runAction } from '../core/registries/ActionRegistry.js';

export default class OnDeath {
	constructor(sprite, config, scene) {
		this.sprite = sprite;
		this.scene = scene;
		this.actions = config.actions ?? [];
	}

	tick(_dt) {
		//empty
	}

	triggerDeath() {
		for (const action of this.actions) {
			runAction(action, this.sprite, this.scene);
		}
	}
}
