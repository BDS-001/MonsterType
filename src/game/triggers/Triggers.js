import { TriggerRegistry } from '../core/registries/TriggerRegistry.js';

export default class Triggers {
	constructor(definition = [], scene) {
		if (!scene) throw new Error('Triggers requires a scene');
		this.scene = scene;
		this.triggers = (definition ?? [])
			.map((triggerConfig) => {
				const TriggerConstructor = TriggerRegistry[triggerConfig.type];
				if (!TriggerConstructor) return null;
				return new TriggerConstructor(null, triggerConfig, scene);
			})
			.filter(Boolean);
	}

	tick(deltaSeconds, sprite) {
		for (const trigger of this.triggers) {
			trigger.sprite = sprite;
			trigger.tick(deltaSeconds);
		}
	}
}
