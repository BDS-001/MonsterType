export default class Weapon {
	constructor(name, description, options = {}) {
		this.name = name;
		this.description = description;
		this.cooldown = options.cooldown ?? 1000;
		this.damage = options.damage || 1;
		this.maxTargets = options.maxTargets || 1;
		this.projectileSprite = options.projectileSprite || null;
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

	handleTargetsSelected(data) {
		if (data.weapon !== this) return;
		this.performFiring(data);
	}

	performFiring(data) {
		const { targets } = data;
		targets.forEach((target) => {
			this.shotEffect(target, data);
			this.scene.events.emit('weapon:fired', { target, projectileSprite: this.projectileSprite });
		});
	}

	shotEffect(target, data) {
		target.takeDamage(this.damage);
	}
}
