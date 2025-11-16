import { describe, it, expect, vi, beforeEach } from 'vitest';
import AttackAnimationManager from './AttackAnimationManager';
import { createMockScene } from '../../test-utils/scene.mock';
import { mockBaseManager } from '../../test-utils/basemanager.mock';
import { GAME_EVENTS } from '../core/GameEvents';

mockBaseManager();

vi.mock('../animations/AnimationFactory.js', () => ({
	default: class AnimationFactory {
		constructor(scene) {
			this.scene = scene;
			this.createAnimation = vi.fn();
		}
	},
}));

vi.mock('../util/cameraEffects.js', () => ({
	shakeCamera: vi.fn(),
}));

describe('AttackAnimationManager', () => {
	let attackAnimationManager;
	let scene;

	beforeEach(() => {
		scene = createMockScene();
		attackAnimationManager = new AttackAnimationManager(scene);
	});

	it('should initialize with correct properties', () => {
		expect(attackAnimationManager.scene).toBe(scene);
		expect(attackAnimationManager.animationFactory).toBeDefined();
	});

	it('should subscribe to WEAPON_FIRED event', () => {
		expect(scene.events.on).toHaveBeenCalledWith(
			GAME_EVENTS.WEAPON_FIRED,
			attackAnimationManager.fireProjectile,
			attackAnimationManager
		);
	});

	describe('fireProjectile', () => {
		it('should create and animate projectile with correct animation type', async () => {
			const mockAnimation = {
				animate: vi.fn(),
			};
			const weaponData = {
				weapon: { attackAnimation: 'basic' },
				target: { x: 200, y: 200 },
			};

			attackAnimationManager.animationFactory.createAnimation.mockReturnValue(mockAnimation);

			attackAnimationManager.fireProjectile(weaponData);

			expect(attackAnimationManager.animationFactory.createAnimation).toHaveBeenCalledWith('basic');
			expect(mockAnimation.animate).toHaveBeenCalledWith(weaponData);
		});

		it('should shake camera when projectile is fired', async () => {
			const { shakeCamera } = await import('../util/cameraEffects.js');
			const mockAnimation = {
				animate: vi.fn(),
			};
			const weaponData = {
				weapon: { attackAnimation: 'lazer' },
			};

			attackAnimationManager.animationFactory.createAnimation.mockReturnValue(mockAnimation);

			attackAnimationManager.fireProjectile(weaponData);

			expect(shakeCamera).toHaveBeenCalledWith(scene);
		});

		it('should not create animation if animation type is null', () => {
			const weaponData = {
				weapon: { attackAnimation: null },
			};

			attackAnimationManager.fireProjectile(weaponData);

			expect(attackAnimationManager.animationFactory.createAnimation).not.toHaveBeenCalled();
		});

		it('should not create animation if animation type is undefined', () => {
			const weaponData = {
				weapon: {},
			};

			attackAnimationManager.fireProjectile(weaponData);

			expect(attackAnimationManager.animationFactory.createAnimation).not.toHaveBeenCalled();
		});

		it('should handle shotgun animation type', () => {
			const mockAnimation = {
				animate: vi.fn(),
			};
			const weaponData = {
				weapon: { attackAnimation: 'shotgun' },
				target: { x: 300, y: 300 },
			};

			attackAnimationManager.animationFactory.createAnimation.mockReturnValue(mockAnimation);

			attackAnimationManager.fireProjectile(weaponData);

			expect(attackAnimationManager.animationFactory.createAnimation).toHaveBeenCalledWith('shotgun');
			expect(mockAnimation.animate).toHaveBeenCalledWith(weaponData);
		});

		it('should handle crossbow animation type', () => {
			const mockAnimation = {
				animate: vi.fn(),
			};
			const weaponData = {
				weapon: { attackAnimation: 'crossbow' },
				target: { x: 400, y: 400 },
			};

			attackAnimationManager.animationFactory.createAnimation.mockReturnValue(mockAnimation);

			attackAnimationManager.fireProjectile(weaponData);

			expect(attackAnimationManager.animationFactory.createAnimation).toHaveBeenCalledWith('crossbow');
			expect(mockAnimation.animate).toHaveBeenCalledWith(weaponData);
		});
	});

	describe('determineAnimationType', () => {
		it('should return weapon attackAnimation property', () => {
			const data = {
				weapon: { attackAnimation: 'basic' },
			};

			const result = attackAnimationManager.determineAnimationType(data);

			expect(result).toBe('basic');
		});

		it('should return undefined if weapon has no attackAnimation', () => {
			const data = {
				weapon: {},
			};

			const result = attackAnimationManager.determineAnimationType(data);

			expect(result).toBeUndefined();
		});

		it('should return correct animation for lazer weapon', () => {
			const data = {
				weapon: { attackAnimation: 'lazer' },
			};

			const result = attackAnimationManager.determineAnimationType(data);

			expect(result).toBe('lazer');
		});

		it('should return correct animation for shotgun weapon', () => {
			const data = {
				weapon: { attackAnimation: 'shotgun' },
			};

			const result = attackAnimationManager.determineAnimationType(data);

			expect(result).toBe('shotgun');
		});

		it('should return correct animation for crossbow weapon', () => {
			const data = {
				weapon: { attackAnimation: 'crossbow' },
			};

			const result = attackAnimationManager.determineAnimationType(data);

			expect(result).toBe('crossbow');
		});
	});

	describe('integration with AnimationFactory', () => {
		it('should pass scene to AnimationFactory constructor', () => {
			const newScene = createMockScene();
			const newManager = new AttackAnimationManager(newScene);

			expect(newManager.animationFactory.scene).toBe(newScene);
		});

		it('should call createAnimation with determined animation type', () => {
			const mockAnimation = {
				animate: vi.fn(),
			};
			const weaponData = {
				weapon: { attackAnimation: 'lazer' },
			};

			vi.spyOn(attackAnimationManager, 'determineAnimationType').mockReturnValue('lazer');
			attackAnimationManager.animationFactory.createAnimation.mockReturnValue(mockAnimation);

			attackAnimationManager.fireProjectile(weaponData);

			expect(attackAnimationManager.determineAnimationType).toHaveBeenCalledWith(weaponData);
			expect(attackAnimationManager.animationFactory.createAnimation).toHaveBeenCalledWith('lazer');
		});
	});
});
