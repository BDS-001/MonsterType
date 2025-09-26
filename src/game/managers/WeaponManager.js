import Weapon from '../entities/weapons/weapon.js';
import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';
import weaponDefs from '../data/weapons.json';

export default class WeaponManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.currentWeapon = null;
		this.STARTER_WEAPON = this.getDefaultWeaponId();

		this.setupEventListeners();
		this.equipWeapon(this.STARTER_WEAPON);
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.KEY_PRESSED, this.handleTypingInput);
		this.subscribe(GAME_EVENTS.RANDOM_WEAPON_REQUESTED, this.handleRandomWeaponRequest);
		this.subscribe(GAME_EVENTS.WEAPON_AMMO_EMPTY, this.handleAmmoEmpty);
		this.subscribe(GAME_EVENTS.WEAPON_AMMO_CHANGED, this.handleAmmoChanged);
		this.subscribeGame(GAME_EVENTS.GAME_OVER, this.handleGameRestart);
	}

	equipWeapon(weaponId) {
		const def = weaponDefs[weaponId];
		if (!def) {
			throw new Error(`WeaponManager: Missing config for '${weaponId}'`);
		}

		if (this.currentWeapon) {
			this.currentWeapon.removeEventListeners();
		}

		this.currentWeapon = new Weapon(def.name, def.description, {
			maxTargets: def.maxTargets ?? 1,
			attackAnimation: def.attackAnimation ?? 'basic',
			maxUsages: def.kind === 'default' ? -1 : (def.maxUsages ?? -1),
		});
		this.currentWeapon.setScene(this.scene);
		this.currentWeapon.currentUsages = this.currentWeapon.maxUsages;
		this.currentWeapon.actions = def.actions ?? null;

		this.emitGame(GAME_EVENTS.WEAPON_EQUIPPED, {
			weapon: this.currentWeapon,
			weaponType: weaponId,
		});

		this.emitGame(GAME_EVENTS.WEAPON_AMMO_CHANGED, {
			ammo: this.currentWeapon.getAmmoCount(),
			maxAmmo: this.currentWeapon.maxUsages,
		});

		return true;
	}

	handleTypingInput(key) {
		if (!this.currentWeapon) {
			throw new Error('WeaponManager: currentWeapon is not set');
		}

		this.emit(GAME_EVENTS.WEAPON_READY_TO_FIRE, {
			key,
			weapon: this.currentWeapon,
		});
	}

	handleRandomWeaponRequest() {
		const randomWeapon = this.getRandomUniqueWeaponId();
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

	getDefaultWeaponId() {
		const entries = Object.entries(weaponDefs);
		const found = entries.find(([, def]) => def.kind === 'default');
		return found ? found[0] : 'pistol';
	}

	getRandomUniqueWeaponId() {
		const ids = Object.keys(weaponDefs).filter(
			(id) => id !== this.STARTER_WEAPON && weaponDefs[id].kind !== 'default'
		);
		return ids[Math.floor(Math.random() * ids.length)] || this.STARTER_WEAPON;
	}
}
