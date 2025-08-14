import BasicShot from '../entities/projectiles/basicShot';
import InstantShot from '../entities/projectiles/instantShot';
import HeavyRounds from '../entities/projectiles/heavyRounds';
import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class ProjectileManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.projectiles = null;
		this.currentWeaponClass = BasicShot;

		this.subscribe(GAME_EVENTS.SCENE_READY, this.setupProjectiles);
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

		this.emit(GAME_EVENTS.PROJECTILES_READY);
	}

	getProjectiles() {
		return this.projectiles;
	}

	getProjectile(projectileType = 'basicShot') {
		if (!this.projectiles) {
			console.warn('ProjectileManager: projectiles not initialized yet');
			return null;
		}

		const ProjectileClass = this.getProjectileClass(projectileType);
		const projectile = new ProjectileClass(this.scene, 0, 0);
		this.projectiles.add(projectile);

		return projectile;
	}

	getProjectileClass(projectileType) {
		switch (projectileType) {
			case 'basicShot':
				return BasicShot;
			case 'instantShot':
				return InstantShot;
			case 'heavyRounds':
				return HeavyRounds;
			default:
				return BasicShot;
		}
	}
}
