import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Weapon {
	constructor(name, description, options = {}) {
		this.name = name;
		this.description = description;
		this.maxTargets = options.maxTargets || 1;
		this.attackAnimation = options.attackAnimation ?? 'basic';
		this.maxUsages = options.maxUsages || -1;
		this.currentUsages = this.maxUsages;
		this.scene = null;
	}

	setScene(scene) {
		this.scene = scene;
		this.setupEventListeners();
	}

	setupEventListeners() {
		if (this.scene) {
			this.scene.events.on('weapon:targets_selected', this.handleTargetsSelected, this);
		}
	}

	removeEventListeners() {
		if (this.scene) {
			this.scene.events.off('weapon:targets_selected', this.handleTargetsSelected, this);
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

		const { targets } = weaponFireData;
		targets.forEach((target) => {
			this.shotEffect(target);
			this.scene.events.emit('weapon:fired', { target, weapon: this });
		});

		if (this.maxUsages <= 0) return;

		this.currentUsages--;
		this.scene?.events.emit(GAME_EVENTS.WEAPON_AMMO_CHANGED, {
			ammo: this.currentUsages,
			maxAmmo: this.maxUsages,
		});

		if (this.currentUsages <= 0) {
			this.onAmmoEmpty();
		}
	}

	onAmmoEmpty() {
		this.scene?.events.emit('weapon:ammo_empty', { weapon: this });
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
