// WIP REOWRK AT LATER TIME

export default class ItemManager {
	constructor(scene) {
		this.scene = scene;
		this.items = null;

		this.setupItems();
	}

	setupItems() {
		this.items = this.scene.physics.add.group({
			maxSize: 10,
			active: false,
			visible: false,
			runChildUpdate: true,
			createCallback: (item) => {
				item.scene = this.scene;
			},
		});
	}

	getProjectiles() {
		return this.projectiles;
	}

	getProjectile() {
		let item = this.items.get();
		if (!item) {
			item = new this.currentWeaponClass(this.scene, 0, 0);
			this.items.add(item);
		}
		return item;
	}

	update() {
		const projectiles = this.projectiles.getChildren();
		for (let i = 0; i < projectiles.length; i++) {
			const projectile = projectiles[i];
			if (projectile.active) {
				projectile.update();
			}
		}
	}
}
