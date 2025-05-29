import Projectile from '../entities/projectile';

export default class ProjectileManager {
	constructor(scene) {
		this.scene = scene;
		this.projectiles = null;

		this.setupProjectiles();
	}

	setupProjectiles() {
		this.projectiles = this.scene.physics.add.group({
			classType: Projectile,
			defaultKey: 'projectile',
			maxSize: 100,
			active: false,
			visible: false,
			runChildUpdate: true,
		});
	}

	getProjectiles() {
		return this.projectiles;
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
