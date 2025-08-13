import BasicRifle from '../entities/weapons/basicRifle.js';
import Shotgun from '../entities/weapons/shotgun.js';
import HeavyGun from '../entities/weapons/heavyGun.js';
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
		]);

		this.setupEventListeners();
		this.equipWeapon('basicRifle');
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.WEAPON_SWITCH, this.handleWeaponSwitch);
		this.subscribe(GAME_EVENTS.LETTER_TYPED, this.handleLetterTyped);
	}

	equipWeapon(weaponType) {
		const WeaponClass = this.weaponTypes.get(weaponType);
		if (!WeaponClass) {
			console.warn(`WeaponManager: Unknown weapon type '${weaponType}'`);
			return false;
		}

		this.currentWeapon = new WeaponClass();
		this.emit(GAME_EVENTS.WEAPON_EQUIPPED, {
			weapon: this.currentWeapon,
			weaponType,
		});

		return true;
	}

	handleWeaponSwitch(data) {
		const { weaponType } = data;
		this.equipWeapon(weaponType);
	}

	handleLetterTyped(data) {
		if (!this.currentWeapon) {
			console.warn('WeaponManager: No weapon equipped');
			return;
		}

		const { source, target } = data;
		const currentTime = this.scene.time.now;

		if (this.currentWeapon.canFireNow(currentTime)) {
			target.handleLetterAccepted();
			const fired = this.currentWeapon.fire(
				this.scene.projectileManager,
				source,
				target,
				currentTime
			);

			if (fired) {
				this.emit(GAME_EVENTS.WEAPON_FIRED, {
					weapon: this.currentWeapon,
					source,
					target,
					timestamp: currentTime,
				});
			}
		}
	}

	getCurrentWeapon() {
		return this.currentWeapon;
	}

	getAvailableWeapons() {
		return Array.from(this.weaponTypes.keys());
	}

	canFire() {
		return this.currentWeapon?.canFireNow(this.scene.time.now) ?? false;
	}
}
