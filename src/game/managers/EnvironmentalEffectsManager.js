import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class EnvironmentalEffectsManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.activeEffects = new Map();
		this.setupEventListeners();
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.ENVIRONMENTAL_EFFECT_ACTIVATE, this.activateEffect);
	}

	activateEffect({ effectType, duration, config }) {
		this.activeEffects.set(effectType, { config });

		// Apply effect to all existing enemies
		const enemies = this.scene.enemyManager.getEnemies().getChildren();
		enemies.forEach((enemy) => {
			if (!enemy.isDestroyed) {
				config.onEnemySpawn?.(enemy);
			}
		});

		this.scene.time.delayedCall(duration, () => {
			this.deactivateEffect(effectType);
		});
	}

	deactivateEffect(effectType) {
		this.activeEffects.delete(effectType);
	}

	isEffectActive(effectType) {
		return this.activeEffects.has(effectType);
	}

	getEffectConfig(effectType) {
		return this.activeEffects.get(effectType)?.config;
	}

	applyEffectsToEnemy(enemy) {
		for (const [effectType, effect] of this.activeEffects) {
			effect.config.onEnemySpawn?.(enemy);
		}
	}

	destroy() {
		this.activeEffects.clear();
		super.destroy();
	}
}
