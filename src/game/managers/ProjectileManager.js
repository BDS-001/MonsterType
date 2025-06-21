import BasicShot from '../entities/projectiles/basicShot';
import HeavyRounds from '../entities/projectiles/heavyRounds';

export default class ProjectileManager {
	constructor(scene) {
		this.scene = scene;
		this.projectiles = null;
		this.currentWeaponClass = HeavyRounds;

		this.setupProjectiles();
	}

	setupProjectiles() {
		this.projectiles = this.scene.physics.add.group({
			maxSize: 100,
			active: false,
			visible: false,
			runChildUpdate: true,
			classType: this.currentWeaponClass,
			createCallback: (projectile) => {
				projectile.scene = this.scene;
			},
		});
	}

	getProjectiles() {
		return this.projectiles;
	}

	getProjectile() {
		let projectile = this.projectiles.get();
		if (!projectile) {
			projectile = new this.currentWeaponClass(this.scene, 0, 0);
			this.projectiles.add(projectile);
		}
		return projectile;
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
