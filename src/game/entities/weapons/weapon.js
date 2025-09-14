export default class Weapon {
	constructor(name, description, options = {}) {
		this.name = name;
		this.description = description;
		this.damage = options.damage || 1;
		this.maxTargets = options.maxTargets || 1;
		this.attackAnimation = options.attackAnimation ?? 'basic';
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
		const { targets } = weaponFireData;
		targets.forEach((target) => {
			this.shotEffect(target);
			this.scene.events.emit('weapon:fired', { target, weapon: this });
		});
	}

	shotEffect(target) {
		target.takeDamage(this.damage);
	}
}
