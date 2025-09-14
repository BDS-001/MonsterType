import BasicRifle from '../entities/weapons/basicRifle.js';
import Shotgun from '../entities/weapons/shotgun.js';
import HeavyGun from '../entities/weapons/heavyGun.js';
import Minigun from '../entities/weapons/miniGun.js';
import LazerGun from '../entities/weapons/lazer.js';
import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class WeaponManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.currentWeapon = null;
		this.weaponTypes = new Map([
			['basicRifle', BasicRifle],
			['shotgun', Shotgun],
			['heavyGun', HeavyGun],
			['minigun', Minigun],
			['lazerGun', LazerGun],
		]);

		this.setupEventListeners();
		this.equipWeapon('basicRifle');
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.WEAPON_SWITCH, this.handleWeaponSwitch);
		this.subscribe(GAME_EVENTS.KEY_PRESSED, this.handleTypingInput);
		this.subscribe(GAME_EVENTS.RANDOM_WEAPON_REQUESTED, this.handleRandomWeaponRequest);
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

		return true;
	}

	handleWeaponSwitch(data) {
		const { weaponType } = data;
		this.equipWeapon(weaponType);
	}

	handleTypingInput(key) {
		if (!this.currentWeapon) return;

		this.emit(GAME_EVENTS.WEAPON_READY_TO_FIRE, {
			key,
			weapon: this.currentWeapon,
		});
	}

	handleRandomWeaponRequest() {
		const weaponKeys = Array.from(this.weaponTypes.keys());
		const randomWeapon = weaponKeys[Math.floor(Math.random() * weaponKeys.length)];
		this.equipWeapon(randomWeapon);
	}

	getCurrentWeapon() {
		return this.currentWeapon;
	}
}
