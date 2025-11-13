import { describe, it, expect, vi, beforeEach } from 'vitest';
import EnvironmentalEffectsManager from './EnvironmentalEffectsManager';
import { createMockScene } from '../../test-utils/scene.mock';
import { mockBaseManager } from '../../test-utils/basemanager.mock';
import { GAME_EVENTS } from '../core/GameEvents';

mockBaseManager();

const createMockWithChaining = (methods) => {
	const mock = {};
	methods.forEach((method) => {
		mock[method] = vi.fn().mockReturnThis();
	});
	return mock;
};

const getMockResult = (mockFn, index = 0) => mockFn.mock.results[index].value;

const setupEnemyMock = (scene, enemies) => {
	scene.enemyManager.getEnemies.mockReturnValue({
		getChildren: vi.fn(() => enemies),
	});
};

describe('EnvironmentalEffectsManager', () => {
	let manager;
	let scene;

	beforeEach(() => {
		scene = createMockScene();
		scene.cameras = {
			main: {
				width: 800,
				height: 600,
				centerX: 400,
				centerY: 300,
			},
		};
		scene.enemyManager = {
			getEnemies: vi.fn(() => ({
				getChildren: vi.fn(() => []),
			})),
		};
		scene.time = {
			delayedCall: vi.fn(),
		};

		scene.add = {
			rectangle: vi.fn(() => createMockWithChaining(['setDepth', 'setScrollFactor', 'destroy'])),
			particles: vi.fn(() => createMockWithChaining(['setDepth', 'setScrollFactor', 'destroy'])),
			graphics: vi.fn(() =>
				createMockWithChaining(['fillStyle', 'fillRect', 'generateTexture', 'destroy'])
			),
		};

		manager = new EnvironmentalEffectsManager(scene);
	});

	it('should initialize with correct properties', () => {
		expect(manager.scene).toBe(scene);
		expect(manager.activeEffects).toBeInstanceOf(Map);
		expect(manager.overlays).toBeInstanceOf(Map);
		expect(manager.effectHandlers).toBeDefined();
		expect(manager.effectHandlers.blizzard).toBeInstanceOf(Function);
		expect(manager.effectHandlers.thunderstorm).toBeInstanceOf(Function);
	});

	describe('setupEventListeners', () => {
		it('should subscribe to ENVIRONMENTAL_EFFECT_ACTIVATE event', () => {
			expect(scene.events.on).toHaveBeenCalledWith(
				GAME_EVENTS.ENVIRONMENTAL_EFFECT_ACTIVATE,
				manager.activateEffect,
				manager
			);
		});
	});

	describe('activateEffect', () => {
		it('should add effect to activeEffects map', () => {
			const config = { onEnemySpawn: vi.fn() };
			manager.activateEffect({ effectType: 'blizzard', duration: 5000, config });

			expect(manager.activeEffects.has('blizzard')).toBe(true);
			expect(manager.activeEffects.get('blizzard').config).toBe(config);
		});

		it('should apply config to existing enemies', () => {
			const mockEnemy1 = { isDestroyed: false };
			const mockEnemy2 = { isDestroyed: false };
			setupEnemyMock(scene, [mockEnemy1, mockEnemy2]);

			const config = { onEnemySpawn: vi.fn() };
			manager.activateEffect({ effectType: 'blizzard', duration: 5000, config });

			expect(config.onEnemySpawn).toHaveBeenCalledWith(mockEnemy1);
			expect(config.onEnemySpawn).toHaveBeenCalledWith(mockEnemy2);
			expect(config.onEnemySpawn).toHaveBeenCalledTimes(2);
		});

		it('should not apply config to destroyed enemies', () => {
			const mockEnemy1 = { isDestroyed: false };
			const mockEnemy2 = { isDestroyed: true };
			setupEnemyMock(scene, [mockEnemy1, mockEnemy2]);

			const config = { onEnemySpawn: vi.fn() };
			manager.activateEffect({ effectType: 'blizzard', duration: 5000, config });

			expect(config.onEnemySpawn).toHaveBeenCalledWith(mockEnemy1);
			expect(config.onEnemySpawn).not.toHaveBeenCalledWith(mockEnemy2);
			expect(config.onEnemySpawn).toHaveBeenCalledTimes(1);
		});

		it('should not throw if config has no onEnemySpawn', () => {
			const config = {};
			expect(() => {
				manager.activateEffect({ effectType: 'blizzard', duration: 5000, config });
			}).not.toThrow();
		});

		it('should call effect handler for blizzard', () => {
			const addBlizzardSpy = vi.spyOn(manager, 'addBlizzardEffect');
			const config = {};
			manager.activateEffect({ effectType: 'blizzard', duration: 5000, config });

			expect(addBlizzardSpy).toHaveBeenCalled();
		});

		it('should call effect handler for thunderstorm', () => {
			const addThunderstormSpy = vi.spyOn(manager, 'addThunderstormEffect');
			const config = {};
			manager.activateEffect({ effectType: 'thunderstorm', duration: 5000, config });

			expect(addThunderstormSpy).toHaveBeenCalled();
		});

		it('should not throw for unknown effect type', () => {
			const config = {};
			expect(() => {
				manager.activateEffect({ effectType: 'unknownEffect', duration: 5000, config });
			}).not.toThrow();
		});

		it('should schedule deactivation after duration', () => {
			const config = {};
			manager.activateEffect({ effectType: 'blizzard', duration: 5000, config });

			expect(scene.time.delayedCall).toHaveBeenCalledWith(5000, expect.any(Function));
		});

		it('should deactivate effect when timer expires', () => {
			const deactivateSpy = vi.spyOn(manager, 'deactivateEffect');
			const config = {};
			manager.activateEffect({ effectType: 'blizzard', duration: 5000, config });

			const timerCallback = scene.time.delayedCall.mock.calls[0][1];
			timerCallback();

			expect(deactivateSpy).toHaveBeenCalledWith('blizzard');
		});
	});

	describe('deactivateEffect', () => {
		it('should remove overlay for effect', () => {
			const removeOverlaySpy = vi.spyOn(manager, 'removeOverlay');
			manager.activeEffects.set('blizzard', { config: {} });

			manager.deactivateEffect('blizzard');

			expect(removeOverlaySpy).toHaveBeenCalledWith('blizzard');
		});

		it('should remove effect from activeEffects', () => {
			manager.activeEffects.set('blizzard', { config: {} });

			manager.deactivateEffect('blizzard');

			expect(manager.activeEffects.has('blizzard')).toBe(false);
		});

		it('should not throw if effect is not active', () => {
			expect(() => {
				manager.deactivateEffect('nonExistentEffect');
			}).not.toThrow();
		});
	});

	const testEffectCreation = (effectType, method, overlayParams, particleTexture) => {
		describe(method, () => {
			it(`should not add ${effectType} if overlay already exists`, () => {
				manager.overlays.set(effectType, { overlay: {}, particles: {} });
				scene.add.rectangle.mockClear();

				manager[method]();

				expect(scene.add.rectangle).not.toHaveBeenCalled();
			});

			it('should create overlay with correct parameters', () => {
				manager[method]();

				expect(scene.add.rectangle).toHaveBeenCalledWith(...overlayParams);
			});

			it('should set correct depth on overlay', () => {
				manager[method]();

				const mockOverlay = getMockResult(scene.add.rectangle);
				expect(mockOverlay.setDepth).toHaveBeenCalledWith(10000);
			});

			it('should set scroll factor to 0 on overlay', () => {
				manager[method]();

				const mockOverlay = getMockResult(scene.add.rectangle);
				expect(mockOverlay.setScrollFactor).toHaveBeenCalledWith(0);
			});

			it(`should create ${particleTexture} particles with correct config`, () => {
				manager[method]();

				expect(scene.add.particles).toHaveBeenCalledWith(0, 0, particleTexture, expect.any(Object));
			});

			it('should set correct depth on particles', () => {
				manager[method]();

				const mockParticles = getMockResult(scene.add.particles);
				expect(mockParticles.setDepth).toHaveBeenCalledWith(10001);
			});

			it('should set scroll factor to 0 on particles', () => {
				manager[method]();

				const mockParticles = getMockResult(scene.add.particles);
				expect(mockParticles.setScrollFactor).toHaveBeenCalledWith(0);
			});

			it('should store overlay and particles in overlays map', () => {
				manager[method]();

				expect(manager.overlays.has(effectType)).toBe(true);
				const effectData = manager.overlays.get(effectType);
				expect(effectData.overlay).toBeDefined();
				expect(effectData.particles).toBeDefined();
			});
		});
	};

	testEffectCreation(
		'blizzard',
		'addBlizzardEffect',
		[400, 300, 800, 600, 0xaaddff, 0.15],
		'snowflake'
	);

	describe('addThunderstormEffect', () => {
		it('should create raindrop texture with graphics', () => {
			manager.addThunderstormEffect();

			const mockGraphics = getMockResult(scene.add.graphics);
			expect(mockGraphics.fillStyle).toHaveBeenCalledWith(0x4d94ff, 1);
			expect(mockGraphics.fillRect).toHaveBeenCalledWith(0, 0, 2, 8);
			expect(mockGraphics.generateTexture).toHaveBeenCalledWith('raindrop', 2, 8);
			expect(mockGraphics.destroy).toHaveBeenCalled();
		});
	});

	testEffectCreation(
		'thunderstorm',
		'addThunderstormEffect',
		[400, 300, 800, 600, 0x0a0a15, 0.6],
		'raindrop'
	);

	describe('createOverlay', () => {
		it('should create rectangle with correct parameters', () => {
			const camera = scene.cameras.main;
			manager.createOverlay(camera, 0xff0000, 0.5);

			expect(scene.add.rectangle).toHaveBeenCalledWith(400, 300, 800, 600, 0xff0000, 0.5);
		});

		it('should set depth to 10000', () => {
			const camera = scene.cameras.main;
			manager.createOverlay(camera, 0xff0000, 0.5);

			const mockOverlay = getMockResult(scene.add.rectangle);
			expect(mockOverlay.setDepth).toHaveBeenCalledWith(10000);
		});

		it('should set scroll factor to 0', () => {
			const camera = scene.cameras.main;
			manager.createOverlay(camera, 0xff0000, 0.5);

			const mockOverlay = getMockResult(scene.add.rectangle);
			expect(mockOverlay.setScrollFactor).toHaveBeenCalledWith(0);
		});

		it('should return the created overlay', () => {
			const camera = scene.cameras.main;
			const result = manager.createOverlay(camera, 0xff0000, 0.5);

			const mockOverlay = getMockResult(scene.add.rectangle);
			expect(result).toBe(mockOverlay);
		});
	});

	describe('removeOverlay', () => {
		const createDestroyableMock = () => ({ destroy: vi.fn() });

		it('should destroy overlay and particles when they exist', () => {
			const mockOverlay = createDestroyableMock();
			const mockParticles = createDestroyableMock();
			manager.overlays.set('blizzard', { overlay: mockOverlay, particles: mockParticles });

			manager.removeOverlay('blizzard');

			expect(mockOverlay.destroy).toHaveBeenCalled();
			expect(mockParticles.destroy).toHaveBeenCalled();
		});

		it('should delete overlay from map', () => {
			const mockOverlay = createDestroyableMock();
			const mockParticles = createDestroyableMock();
			manager.overlays.set('blizzard', { overlay: mockOverlay, particles: mockParticles });

			manager.removeOverlay('blizzard');

			expect(manager.overlays.has('blizzard')).toBe(false);
		});

		it('should not throw if overlay does not exist', () => {
			expect(() => manager.removeOverlay('nonExistent')).not.toThrow();
		});

		it('should not throw if overlay is null', () => {
			manager.overlays.set('blizzard', { overlay: null, particles: null });
			expect(() => manager.removeOverlay('blizzard')).not.toThrow();
		});

		it('should handle missing overlay property', () => {
			const mockParticles = createDestroyableMock();
			manager.overlays.set('blizzard', { particles: mockParticles });

			expect(() => manager.removeOverlay('blizzard')).not.toThrow();
			expect(mockParticles.destroy).toHaveBeenCalled();
		});

		it('should handle missing particles property', () => {
			const mockOverlay = createDestroyableMock();
			manager.overlays.set('blizzard', { overlay: mockOverlay });

			expect(() => manager.removeOverlay('blizzard')).not.toThrow();
			expect(mockOverlay.destroy).toHaveBeenCalled();
		});
	});

	describe('isEffectActive', () => {
		it('should return true for active effect', () => {
			manager.activeEffects.set('blizzard', { config: {} });

			expect(manager.isEffectActive('blizzard')).toBe(true);
		});

		it('should return false for inactive effect', () => {
			expect(manager.isEffectActive('blizzard')).toBe(false);
		});
	});

	describe('getEffectConfig', () => {
		it('should return config for active effect', () => {
			const config = { onEnemySpawn: vi.fn() };
			manager.activeEffects.set('blizzard', { config });

			expect(manager.getEffectConfig('blizzard')).toBe(config);
		});

		it('should return undefined for inactive effect', () => {
			expect(manager.getEffectConfig('blizzard')).toBeUndefined();
		});
	});

	describe('applyEffectsToEnemy', () => {
		it('should apply all active effects to enemy', () => {
			const mockEnemy = { id: 1 };
			const config1 = { onEnemySpawn: vi.fn() };
			const config2 = { onEnemySpawn: vi.fn() };

			manager.activeEffects.set('blizzard', { config: config1 });
			manager.activeEffects.set('thunderstorm', { config: config2 });

			manager.applyEffectsToEnemy(mockEnemy);

			expect(config1.onEnemySpawn).toHaveBeenCalledWith(mockEnemy);
			expect(config2.onEnemySpawn).toHaveBeenCalledWith(mockEnemy);
		});

		it('should not throw if effect has no onEnemySpawn', () => {
			const mockEnemy = { id: 1 };
			manager.activeEffects.set('blizzard', { config: {} });

			expect(() => {
				manager.applyEffectsToEnemy(mockEnemy);
			}).not.toThrow();
		});

		it('should not apply effects when no effects are active', () => {
			const mockEnemy = { id: 1 };

			expect(() => {
				manager.applyEffectsToEnemy(mockEnemy);
			}).not.toThrow();
		});
	});

	describe('destroy', () => {
		const createDestroyableMock = () => ({ destroy: vi.fn() });

		it('should destroy all overlays and particles', () => {
			const mockOverlay1 = createDestroyableMock();
			const mockParticles1 = createDestroyableMock();
			const mockOverlay2 = createDestroyableMock();
			const mockParticles2 = createDestroyableMock();

			manager.overlays.set('blizzard', { overlay: mockOverlay1, particles: mockParticles1 });
			manager.overlays.set('thunderstorm', { overlay: mockOverlay2, particles: mockParticles2 });

			manager.destroy();

			expect(mockOverlay1.destroy).toHaveBeenCalled();
			expect(mockParticles1.destroy).toHaveBeenCalled();
			expect(mockOverlay2.destroy).toHaveBeenCalled();
			expect(mockParticles2.destroy).toHaveBeenCalled();
		});

		it('should clear overlays map', () => {
			manager.overlays.set('blizzard', {
				overlay: createDestroyableMock(),
				particles: createDestroyableMock(),
			});

			manager.destroy();

			expect(manager.overlays.size).toBe(0);
		});

		it('should clear activeEffects map', () => {
			manager.activeEffects.set('blizzard', { config: {} });

			manager.destroy();

			expect(manager.activeEffects.size).toBe(0);
		});

		it('should not throw if overlays are null', () => {
			manager.overlays.set('blizzard', { overlay: null, particles: null });
			expect(() => manager.destroy()).not.toThrow();
		});

		it('should call super.destroy', () => {
			const destroySpy = vi.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(manager)), 'destroy');

			manager.destroy();

			expect(destroySpy).toHaveBeenCalled();
		});
	});
});
