import { describe, it, expect, vi, beforeEach } from 'vitest';
import WeaponManager from './WeaponManager';
import { createMockScene } from '../../test-utils/scene.mock';
import { mockBaseManager } from '../../test-utils/basemanager.mock';
import { GAME_EVENTS } from '../core/GameEvents';

mockBaseManager();

vi.mock('../entities/weapons/pistol.js', () => ({ default: class {} }));
vi.mock('../entities/weapons/crossbow.js', () => ({ default: class {} }));
vi.mock('../entities/weapons/shotgun.js', () => ({ default: class {} }));
vi.mock('../entities/weapons/miniGun.js', () => ({ default: class {} }));
vi.mock('../entities/weapons/dualPistols.js', () => ({ default: class {} }));
vi.mock('../entities/weapons/lazer.js', () => ({ default: class {} }));

const createMockWeapon = (name, maxUsages = -1) => {
	return class MockWeapon {
		constructor() {
			this.name = name;
			this.maxUsages = maxUsages;
			this.setScene = vi.fn();
			this.removeEventListeners = vi.fn();
			this.update = vi.fn();
			this.getAmmoCount = vi.fn(() => maxUsages);
		}
	};
};

describe('WeaponManager', () => {
	let weaponManager;
	let scene;
	let mockWeaponTypes;

	beforeEach(() => {
		scene = createMockScene();
		mockWeaponTypes = new Map([
			['pistol', createMockWeapon('Pistol', -1)],
			['crossbow', createMockWeapon('Crossbow', 40)],
			['shotgun', createMockWeapon('Shotgun', 30)],
			['minigun', createMockWeapon('Minigun', 200)],
			['dualPistols', createMockWeapon('DualPistols', 60)],
			['lazerGun', createMockWeapon('LazerGun', 50)],
		]);
		weaponManager = new WeaponManager(scene, mockWeaponTypes);
	});

	it('should initialize with correct properties', () => {
		expect(weaponManager.scene).toBe(scene);
		expect(weaponManager.STARTER_WEAPON).toBe('pistol');
		expect(weaponManager.weaponTypes).toBeInstanceOf(Map);
		expect(weaponManager.weaponTypes.size).toBe(6);
	});

	it('should initialize with pistol equipped', () => {
		expect(weaponManager.currentWeapon).toBeTruthy();
		expect(weaponManager.currentWeapon.name).toBe('Pistol');
	});

	it('should initialize with correct function calls', () => {
		const setupListeners = vi.spyOn(WeaponManager.prototype, 'setupEventListeners');
		const equipWeapon = vi.spyOn(WeaponManager.prototype, 'equipWeapon');
		new WeaponManager(scene, mockWeaponTypes);
		expect(setupListeners).toHaveBeenCalled();
		expect(equipWeapon).toHaveBeenCalledWith('pistol');
	});

	it('should subscribe to correct events', () => {
		expect(scene.events.on).toHaveBeenCalledWith(
			GAME_EVENTS.KEY_PRESSED,
			weaponManager.handleTypingInput,
			weaponManager
		);
		expect(scene.events.on).toHaveBeenCalledWith(
			GAME_EVENTS.RANDOM_WEAPON_REQUESTED,
			weaponManager.handleRandomWeaponRequest,
			weaponManager
		);
		expect(scene.events.on).toHaveBeenCalledWith(
			'weapon:ammo_empty',
			weaponManager.handleAmmoEmpty,
			weaponManager
		);
		expect(scene.events.on).toHaveBeenCalledWith(
			GAME_EVENTS.WEAPON_AMMO_CHANGED,
			weaponManager.handleAmmoChanged,
			weaponManager
		);
		expect(scene.game.events.on).toHaveBeenCalledWith(
			GAME_EVENTS.GAME_OVER,
			weaponManager.handleGameRestart,
			weaponManager
		);
	});

	describe('equipWeapon', () => {
		it('should equip a valid weapon type', () => {
			const result = weaponManager.equipWeapon('crossbow');
			expect(result).toBe(true);
			expect(weaponManager.currentWeapon.name).toBe('Crossbow');
		});

		it('should set scene on the equipped weapon', () => {
			weaponManager.equipWeapon('shotgun');
			expect(weaponManager.currentWeapon.setScene).toHaveBeenCalledWith(scene);
		});

		it('should remove event listeners from previous weapon', () => {
			const firstWeapon = weaponManager.currentWeapon;
			weaponManager.equipWeapon('minigun');
			expect(firstWeapon.removeEventListeners).toHaveBeenCalled();
		});

		it('should emit WEAPON_EQUIPPED event with correct data', () => {
			weaponManager.equipWeapon('dualPistols');
			expect(scene.game.events.emit).toHaveBeenCalledWith(
				GAME_EVENTS.WEAPON_EQUIPPED,
				expect.objectContaining({
					weapon: weaponManager.currentWeapon,
					weaponType: 'dualPistols',
				})
			);
		});

		it('should emit WEAPON_AMMO_CHANGED event after equipping', () => {
			weaponManager.equipWeapon('lazerGun');
			const weapon = weaponManager.currentWeapon;
			expect(scene.game.events.emit).toHaveBeenCalledWith(
				GAME_EVENTS.WEAPON_AMMO_CHANGED,
				expect.objectContaining({
					ammo: weapon.getAmmoCount(),
					maxAmmo: weapon.maxUsages,
				})
			);
		});

		it('should return false for unknown weapon type', () => {
			const result = weaponManager.equipWeapon('invalidWeapon');
			expect(result).toBe(false);
		});

		it('should warn for unknown weapon type', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			weaponManager.equipWeapon('unknownWeapon');
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				"WeaponManager: Unknown weapon type 'unknownWeapon'"
			);
			consoleWarnSpy.mockRestore();
		});

		it('should not change current weapon if invalid type', () => {
			const originalWeapon = weaponManager.currentWeapon;
			weaponManager.equipWeapon('invalidWeapon');
			expect(weaponManager.currentWeapon).toBe(originalWeapon);
		});
	});

	describe('handleTypingInput', () => {
		it('should emit WEAPON_READY_TO_FIRE event with key and weapon', () => {
			const key = 'a';
			weaponManager.handleTypingInput(key);
			expect(scene.events.emit).toHaveBeenCalledWith(
				GAME_EVENTS.WEAPON_READY_TO_FIRE,
				expect.objectContaining({
					key: 'a',
					weapon: weaponManager.currentWeapon,
				})
			);
		});

		it('should not emit event if no current weapon', () => {
			weaponManager.currentWeapon = null;
			scene.events.emit.mockClear();
			weaponManager.handleTypingInput('a');
			expect(scene.events.emit).not.toHaveBeenCalledWith(
				GAME_EVENTS.WEAPON_READY_TO_FIRE,
				expect.anything()
			);
		});
	});

	describe('handleRandomWeaponRequest', () => {
		it('should call getRandomWeaponKey with starter weapon excluded', () => {
			vi.spyOn(weaponManager, 'getRandomWeaponKey').mockReturnValue('shotgun');
			const equipSpy = vi.spyOn(weaponManager, 'equipWeapon');

			weaponManager.handleRandomWeaponRequest();

			expect(weaponManager.getRandomWeaponKey).toHaveBeenCalledWith(['pistol']);
			expect(equipSpy).toHaveBeenCalledWith('shotgun');
		});

		it('should equip the weapon returned by getRandomWeaponKey', () => {
			vi.spyOn(weaponManager, 'getRandomWeaponKey').mockReturnValue('lazerGun');
			weaponManager.handleRandomWeaponRequest();
			expect(weaponManager.currentWeapon.name).toBe('LazerGun');
		});
	});

	describe('handleAmmoEmpty', () => {
		it('should equip starter weapon when ammo is empty', () => {
			weaponManager.equipWeapon('crossbow');
			const equipSpy = vi.spyOn(weaponManager, 'equipWeapon');

			weaponManager.handleAmmoEmpty();

			expect(equipSpy).toHaveBeenCalledWith('pistol');
			expect(weaponManager.currentWeapon.name).toBe('Pistol');
		});
	});

	describe('handleAmmoChanged', () => {
		it('should emit WEAPON_AMMO_CHANGED event to game with provided data', () => {
			const data = { ammo: 5, maxAmmo: 10 };
			weaponManager.handleAmmoChanged(data);
			expect(scene.game.events.emit).toHaveBeenCalledWith(GAME_EVENTS.WEAPON_AMMO_CHANGED, data);
		});
	});

	describe('handleGameRestart', () => {
		it('should equip starter weapon when reset is true', () => {
			weaponManager.equipWeapon('minigun');
			const equipSpy = vi.spyOn(weaponManager, 'equipWeapon');
			const data = { reset: true };

			weaponManager.handleGameRestart(data);

			expect(equipSpy).toHaveBeenCalledWith('pistol');
			expect(weaponManager.currentWeapon.name).toBe('Pistol');
		});

		it('should not equip starter weapon when reset is false', () => {
			weaponManager.equipWeapon('shotgun');
			const equipSpy = vi.spyOn(weaponManager, 'equipWeapon');
			const data = { reset: false };

			weaponManager.handleGameRestart(data);

			expect(equipSpy).not.toHaveBeenCalled();
			expect(weaponManager.currentWeapon.name).toBe('Shotgun');
		});

		it('should not throw error when data is undefined', () => {
			expect(() => weaponManager.handleGameRestart(undefined)).not.toThrow();
		});

		it('should not equip starter weapon when data is undefined', () => {
			weaponManager.equipWeapon('crossbow');
			const equipSpy = vi.spyOn(weaponManager, 'equipWeapon');

			weaponManager.handleGameRestart(undefined);

			expect(equipSpy).not.toHaveBeenCalled();
		});
	});

	describe('update', () => {
		it('should call update on current weapon if it exists', () => {
			const delta = 16;
			weaponManager.update(delta);
			expect(weaponManager.currentWeapon.update).toHaveBeenCalledWith(delta);
		});

		it('should not throw error if current weapon has no update method', () => {
			weaponManager.currentWeapon.update = undefined;
			expect(() => weaponManager.update(16)).not.toThrow();
		});

		it('should not throw error if current weapon is null', () => {
			weaponManager.currentWeapon = null;
			expect(() => weaponManager.update(16)).not.toThrow();
		});
	});

	describe('getRandomWeaponKey', () => {
		it('should return a random weapon key', () => {
			const key = weaponManager.getRandomWeaponKey();
			expect(weaponManager.weaponTypes.has(key)).toBe(true);
		});

		it('should exclude specified weapon keys', () => {
			const exclude = ['pistol', 'crossbow'];
			const results = new Set();

			for (let i = 0; i < 50; i++) {
				const key = weaponManager.getRandomWeaponKey(exclude);
				results.add(key);
				expect(exclude).not.toContain(key);
			}

			expect(results.size).toBeGreaterThan(0);
		});

		it('should return from available weapons when exclude is provided', () => {
			const exclude = ['pistol'];
			const key = weaponManager.getRandomWeaponKey(exclude);
			const availableKeys = ['crossbow', 'shotgun', 'minigun', 'dualPistols', 'lazerGun'];
			expect(availableKeys).toContain(key);
		});

		it('should return any weapon when exclude is empty', () => {
			const key = weaponManager.getRandomWeaponKey([]);
			const allKeys = ['pistol', 'crossbow', 'shotgun', 'minigun', 'dualPistols', 'lazerGun'];
			expect(allKeys).toContain(key);
		});
	});

	describe('dependency injection', () => {
		it('should use injected weapon types when provided', () => {
			expect(weaponManager.weaponTypes).toBe(mockWeaponTypes);
		});

		it('should use default weapons when no types injected', () => {
			const defaultWeapons = weaponManager.getDefaultWeapons();
			expect(defaultWeapons).toBeInstanceOf(Map);
			expect(defaultWeapons.size).toBe(6);
			expect(defaultWeapons.has('pistol')).toBe(true);
			expect(defaultWeapons.has('crossbow')).toBe(true);
			expect(defaultWeapons.has('shotgun')).toBe(true);
			expect(defaultWeapons.has('minigun')).toBe(true);
			expect(defaultWeapons.has('dualPistols')).toBe(true);
			expect(defaultWeapons.has('lazerGun')).toBe(true);
		});
	});
});
