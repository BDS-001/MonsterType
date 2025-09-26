import { runAction } from '../core/registries/ActionRegistry.js';

export default class OnTimer {
	constructor(sprite, config, scene) {
		this.sprite = sprite;
		this.scene = scene;
		this.interval = config.interval ?? 1;
		this.actions = config.actions ?? [];
		this.timer = null;
	}

	tick(_dt) {
		if (this.timer) return;
		this.timer = this.scene.time.addEvent({
			delay: this.interval * 1000,
			callback: () => {
				for (const action of this.actions) {
					runAction(action, this.sprite, this.scene);
				}
			},
			loop: true,
		});
	}

	destroy() {
		if (this.timer) {
			this.timer.destroy();
			this.timer = null;
		}
	}
}
