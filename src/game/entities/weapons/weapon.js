export default class Weapon {
	constructor(name, description, options = {}) {
		this.name = name;
		this.description = description;
		this.cooldown = options.cooldown ?? 1000;
		this.damage = options.damage || 1;
		this.maxTargets = options.maxTargets || 1;
		this.attackAnimation = options.attackAnimation ?? 'basic';
		this.lastFireTime = 0;
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

	canFireNow(currentTime) {
		return this.cooldown === 0 || currentTime - this.lastFireTime >= this.cooldown;
	}

	fire(currentTime) {
		if (!this.canFireNow(currentTime)) return false;
		this.lastFireTime = currentTime;
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
