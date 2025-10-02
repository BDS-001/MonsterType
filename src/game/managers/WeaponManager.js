import Pistol from '../entities/weapons/pistol.js';
import Crossbow from '../entities/weapons/crossbow.js';
import Shotgun from '../entities/weapons/shotgun.js';
import Minigun from '../entities/weapons/miniGun.js';
import LazerGun from '../entities/weapons/lazer.js';
import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class WeaponManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.currentWeapon = null;
		this.STARTER_WEAPON = 'pistol';
		this.weaponTypes = new Map([
			['pistol', Pistol],
			['crossbow', Crossbow],
			['shotgun', Shotgun],
			['minigun', Minigun],
			['lazerGun', LazerGun],
		]);

		this.setupEventListeners();
		this.equipWeapon(this.STARTER_WEAPON);
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.KEY_PRESSED, this.handleTypingInput);
		this.subscribe(GAME_EVENTS.RANDOM_WEAPON_REQUESTED, this.handleRandomWeaponRequest);
		this.subscribe('weapon:ammo_empty', this.handleAmmoEmpty);
		this.subscribe(GAME_EVENTS.WEAPON_AMMO_CHANGED, this.handleAmmoChanged);
		this.subscribeGame(GAME_EVENTS.GAME_OVER, this.handleGameRestart);
	}

	equipWeapon(weaponType) {
		const WeaponClass = this.weaponTypes.get(weaponType);
		if (!WeaponClass) {
			console.warn(`WeaponManager: Unknown weapon type '${weaponType}'`);
			return false;
		}

		if (this.currentWeapon) {
			this.currentWeapon.removeEventListeners();
		}

		this.currentWeapon = new WeaponClass();
		this.currentWeapon.setScene(this.scene);

		this.emitGame(GAME_EVENTS.WEAPON_EQUIPPED, {
			weapon: this.currentWeapon,
			weaponType,
		});

		this.emitGame(GAME_EVENTS.WEAPON_AMMO_CHANGED, {
			ammo: this.currentWeapon.getAmmoCount(),
			maxAmmo: this.currentWeapon.maxUsages,
		});

		return true;
	}

	handleTypingInput(key) {
		if (!this.currentWeapon) return;

		this.emit(GAME_EVENTS.WEAPON_READY_TO_FIRE, {
			key,
			weapon: this.currentWeapon,
		});
	}

	handleRandomWeaponRequest() {
		const randomWeapon = this.getRandomWeaponKey([this.STARTER_WEAPON]);
		this.equipWeapon(randomWeapon);
	}

	handleAmmoEmpty() {
		this.equipWeapon(this.STARTER_WEAPON);
	}

	handleAmmoChanged(data) {
		this.emitGame(GAME_EVENTS.WEAPON_AMMO_CHANGED, data);
	}

	handleGameRestart(data) {
		if (data && data.reset) {
			this.equipWeapon(this.STARTER_WEAPON);
		}
	}

	update(delta) {
		if (this.currentWeapon && this.currentWeapon.update) {
			this.currentWeapon.update(delta);
		}
	}

	getRandomWeaponKey(exclude = []) {
		const excludeSet = new Set(exclude);
		const keys = Array.from(this.weaponTypes.keys()).filter((k) => !excludeSet.has(k));
		return keys[Math.floor(Math.random() * keys.length)];
	}
}
