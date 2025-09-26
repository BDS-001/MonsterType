import { GAME_EVENTS } from '../../core/GameEvents.js';
import { runWeaponAction } from '../../core/registries/WeaponActionRegistry.js';

export default class Weapon {
	constructor(name, description, options = {}) {
		this.name = name;
		this.description = description;
		this.maxTargets = options.maxTargets || 1;
		this.attackAnimation = options.attackAnimation ?? 'basic';
		this.maxUsages = options.maxUsages || -1;
		this.currentUsages = this.maxUsages;
		this.scene = null;
		this.actions = null;
	}

	setScene(scene) {
		this.scene = scene;
		this.setupEventListeners();
	}

	setupEventListeners() {
		if (this.scene) {
			this.scene.events.on(GAME_EVENTS.TARGETS_SELECTED, this.handleTargetsSelected, this);
		}
	}

	removeEventListeners() {
		if (this.scene) {
			this.scene.events.off(GAME_EVENTS.TARGETS_SELECTED, this.handleTargetsSelected, this);
		}
	}

	fire() {
		return true;
	}

	handleTargetsSelected(weaponFireData) {
		if (weaponFireData.weapon !== this) return;
		this.performFiring(weaponFireData);
	}

	performFiring(weaponFireData) {
		if (this.currentUsages === 0) return;

		if (Array.isArray(this.actions) && this.actions.length > 0) {
			for (const action of this.actions) {
				runWeaponAction(action, this.scene.player, this.scene, this, weaponFireData);
			}
		} else {
			const { targets, originX, originY } = weaponFireData;
			targets.forEach((target) => {
				this.shotEffect(target);
				this.scene.events.emit(GAME_EVENTS.WEAPON_FIRED, {
					target,
					weapon: this,
					originX,
					originY,
				});
			});
		}

		if (this.maxUsages <= 0) return;

		this.currentUsages--;
		if (!this.scene?.events) {
			throw new Error('Weapon.performFiring: scene.events missing');
		}
		this.scene.events.emit(GAME_EVENTS.WEAPON_AMMO_CHANGED, {
			ammo: this.currentUsages,
			maxAmmo: this.maxUsages,
		});

		if (this.currentUsages <= 0) {
			this.onAmmoEmpty();
		}
	}

	onAmmoEmpty() {
		if (!this.scene?.events) {
			throw new Error('Weapon.onAmmoEmpty: scene.events missing');
		}
		this.scene.events.emit(GAME_EVENTS.WEAPON_AMMO_EMPTY, { weapon: this });
	}

	hasAmmo() {
		return this.maxUsages === -1 || this.currentUsages > 0;
	}

	getAmmoCount() {
		return this.maxUsages === -1 ? -1 : this.currentUsages;
	}

	shotEffect(target) {
		target.takeDamage();
	}
}
