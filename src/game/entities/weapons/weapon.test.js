import { createMockScene } from '../../../test-utils/scene.mock.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Weapon from './weapon.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

describe('Weapon', () => {
	let weapon;
	let mockScene;

	beforeEach(() => {
		mockScene = createMockScene();

		weapon = new Weapon('Test Weapon', 'A test weapon description', {
			maxTargets: 2,
			attackAnimation: 'basic',
			maxUsages: 10,
		});
	});

	describe('constructor', () => {
		it('should initialize with correct properties', () => {
			expect(weapon.name).toBe('Test Weapon');
			expect(weapon.description).toBe('A test weapon description');
			expect(weapon.maxTargets).toBe(2);
			expect(weapon.attackAnimation).toBe('basic');
			expect(weapon.maxUsages).toBe(10);
			expect(weapon.currentUsages).toBe(10);
			expect(weapon.scene).toBeNull();
		});

		it('should use default values when options are not provided', () => {
			const defaultWeapon = new Weapon('Default', 'Default weapon');

			expect(defaultWeapon.maxTargets).toBe(1);
			expect(defaultWeapon.attackAnimation).toBe('basic');
			expect(defaultWeapon.maxUsages).toBe(-1);
			expect(defaultWeapon.currentUsages).toBe(-1);
		});
	});

	describe('setScene', () => {
		it('should set the scene and setup event listeners', () => {
			weapon.setScene(mockScene);

			expect(weapon.scene).toBe(mockScene);
			expect(mockScene.events.on).toHaveBeenCalledWith(
				GAME_EVENTS.TARGETS_SELECTED,
				weapon.handleTargetsSelected,
				weapon
			);
		});
	});

	describe('removeEventListeners', () => {
		it('should remove event listeners', () => {
			weapon.setScene(mockScene);
			weapon.removeEventListeners();

			expect(mockScene.events.off).toHaveBeenCalledWith(
				GAME_EVENTS.TARGETS_SELECTED,
				weapon.handleTargetsSelected,
				weapon
			);
		});
	});

	describe('fire', () => {
		it('should return true', () => {
			expect(weapon.fire()).toBe(true);
		});
	});

	describe('handleTargetsSelected', () => {
		beforeEach(() => {
			weapon.setScene(mockScene);
			weapon.performFiring = vi.fn();
		});

		it('should call performFiring when weapon matches', () => {
			const weaponFireData = {
				weapon: weapon,
				targets: [],
				originX: 100,
				originY: 200,
			};

			weapon.handleTargetsSelected(weaponFireData);

			expect(weapon.performFiring).toHaveBeenCalledWith(weaponFireData);
		});

		it('should not call performFiring when weapon does not match', () => {
			const otherWeapon = new Weapon('Other', 'Other weapon');
			const weaponFireData = {
				weapon: otherWeapon,
				targets: [],
				originX: 100,
				originY: 200,
			};

			weapon.handleTargetsSelected(weaponFireData);

			expect(weapon.performFiring).not.toHaveBeenCalled();
		});
	});

	describe('performFiring', () => {
		let mockTarget;

		beforeEach(() => {
			mockTarget = {
				takeDamage: vi.fn(),
			};
			weapon.setScene(mockScene);
		});

		it('should not fire when ammo is empty', () => {
			weapon.currentUsages = 0;
			const weaponFireData = {
				weapon: weapon,
				targets: [mockTarget],
				originX: 100,
				originY: 200,
			};

			weapon.performFiring(weaponFireData);

			expect(mockTarget.takeDamage).not.toHaveBeenCalled();
		});

		it('should damage all targets and emit events', () => {
			const mockTarget2 = { takeDamage: vi.fn() };
			const weaponFireData = {
				weapon: weapon,
				targets: [mockTarget, mockTarget2],
				originX: 100,
				originY: 200,
			};

			weapon.performFiring(weaponFireData);

			expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
			expect(mockTarget2.takeDamage).toHaveBeenCalledTimes(1);
			expect(mockScene.events.emit).toHaveBeenCalledWith(GAME_EVENTS.WEAPON_FIRED, {
				target: mockTarget,
				weapon: weapon,
				originX: 100,
				originY: 200,
			});
			expect(mockScene.events.emit).toHaveBeenCalledWith(GAME_EVENTS.WEAPON_FIRED, {
				target: mockTarget2,
				weapon: weapon,
				originX: 100,
				originY: 200,
			});
		});

		it('should decrement ammo count for limited ammo weapons', () => {
			const weaponFireData = {
				weapon: weapon,
				targets: [mockTarget],
				originX: 100,
				originY: 200,
			};

			weapon.performFiring(weaponFireData);

			expect(weapon.currentUsages).toBe(9);
			expect(mockScene.events.emit).toHaveBeenCalledWith(GAME_EVENTS.WEAPON_AMMO_CHANGED, {
				ammo: 9,
				maxAmmo: 10,
			});
		});

		it('should not decrement ammo count for unlimited ammo weapons', () => {
			const unlimitedWeapon = new Weapon('Unlimited', 'Unlimited ammo', {
				maxUsages: -1,
			});
			unlimitedWeapon.setScene(mockScene);

			const weaponFireData = {
				weapon: unlimitedWeapon,
				targets: [mockTarget],
				originX: 100,
				originY: 200,
			};

			unlimitedWeapon.performFiring(weaponFireData);

			expect(unlimitedWeapon.currentUsages).toBe(-1);
			expect(mockScene.events.emit).not.toHaveBeenCalledWith(
				GAME_EVENTS.WEAPON_AMMO_CHANGED,
				expect.any(Object)
			);
		});

		it('should call onAmmoEmpty when ammo reaches zero', () => {
			weapon.currentUsages = 1;
			weapon.onAmmoEmpty = vi.fn();

			const weaponFireData = {
				weapon: weapon,
				targets: [mockTarget],
				originX: 100,
				originY: 200,
			};

			weapon.performFiring(weaponFireData);

			expect(weapon.currentUsages).toBe(0);
			expect(weapon.onAmmoEmpty).toHaveBeenCalled();
		});

		it('should not call onAmmoEmpty when ammo is still available', () => {
			weapon.currentUsages = 5;
			weapon.onAmmoEmpty = vi.fn();

			const weaponFireData = {
				weapon: weapon,
				targets: [mockTarget],
				originX: 100,
				originY: 200,
			};

			weapon.performFiring(weaponFireData);

			expect(weapon.currentUsages).toBe(4);
			expect(weapon.onAmmoEmpty).not.toHaveBeenCalled();
		});
	});

	describe('onAmmoEmpty', () => {
		beforeEach(() => {
			weapon.setScene(mockScene);
		});

		it('should emit weapon:ammo_empty event', () => {
			weapon.onAmmoEmpty();

			expect(mockScene.events.emit).toHaveBeenCalledWith('weapon:ammo_empty', {
				weapon: weapon,
			});
		});
	});

	describe('hasAmmo', () => {
		it('should return true for unlimited ammo weapons', () => {
			const unlimitedWeapon = new Weapon('Unlimited', 'Unlimited ammo', {
				maxUsages: -1,
			});

			expect(unlimitedWeapon.hasAmmo()).toBe(true);
		});

		it('should return true when weapon has ammo', () => {
			weapon.currentUsages = 5;

			expect(weapon.hasAmmo()).toBe(true);
		});

		it('should return false when weapon has no ammo', () => {
			weapon.currentUsages = 0;

			expect(weapon.hasAmmo()).toBe(false);
		});
	});

	describe('getAmmoCount', () => {
		it('should return -1 for unlimited ammo weapons', () => {
			const unlimitedWeapon = new Weapon('Unlimited', 'Unlimited ammo', {
				maxUsages: -1,
			});

			expect(unlimitedWeapon.getAmmoCount()).toBe(-1);
		});

		it('should return current ammo count for limited ammo weapons', () => {
			weapon.currentUsages = 7;

			expect(weapon.getAmmoCount()).toBe(7);
		});
	});

	describe('shotEffect', () => {
		let mockTarget;

		beforeEach(() => {
			mockTarget = {
				takeDamage: vi.fn(),
			};
		});

		it('should call takeDamage on the target', () => {
			weapon.shotEffect(mockTarget);

			expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
		});
	});
});
