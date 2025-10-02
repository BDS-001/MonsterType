import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class EnvironmentalEffectsManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.activeEffects = new Map();
		this.overlays = new Map();
		this.setupEventListeners();
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.ENVIRONMENTAL_EFFECT_ACTIVATE, this.activateEffect);
	}

	activateEffect({ effectType, duration, config }) {
		this.activeEffects.set(effectType, { config });
		const enemies = this.scene.enemyManager.getEnemies().getChildren();
		enemies.forEach((enemy) => {
			if (!enemy.isDestroyed) {
				config.onEnemySpawn?.(enemy);
			}
		});

		if (effectType === 'blizzard') {
			this.addBlizzardEffect();
		}

		this.scene.time.delayedCall(duration, () => {
			this.deactivateEffect(effectType);
		});
	}

	deactivateEffect(effectType) {
		if (effectType === 'blizzard') {
			this.removeOverlay('blizzard');
		}

		this.activeEffects.delete(effectType);
	}

	addBlizzardEffect() {
		if (this.overlays.has('blizzard')) return;

		const camera = this.scene.cameras.main;
		const overlay = this.scene.add.rectangle(
			camera.centerX,
			camera.centerY,
			camera.width,
			camera.height,
			0xaaddff,
			0.15
		);
		overlay.setDepth(10000);
		overlay.setScrollFactor(0);

		const particles = this.scene.add.particles(0, 0, 'snowflake', {
			x: { min: 0, max: camera.width },
			y: { min: -10, max: camera.height },
			lifespan: 8000,
			speedY: { min: 30, max: 80 },
			speedX: { min: -20, max: 20 },
			scale: { min: 0.4, max: 1.2 },
			alpha: { start: 0.9, end: 0.3 },
			rotate: { min: 0, max: 360 },
			angle: { min: -10, max: 10 },
			frequency: 80,
			quantity: 3,
		});
		particles.setDepth(10001);
		particles.setScrollFactor(0);

		this.overlays.set('blizzard', { overlay, particles });
	}

	removeOverlay(effectType) {
		const data = this.overlays.get(effectType);
		if (data) {
			if (data.overlay) {
				data.overlay.destroy();
			}
			if (data.particles) {
				data.particles.destroy();
			}
			this.overlays.delete(effectType);
		}
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
		this.overlays.forEach((data) => {
			data.overlay?.destroy();
			data.particles?.destroy();
		});
		this.overlays.clear();
		this.activeEffects.clear();
		super.destroy();
	}
}
