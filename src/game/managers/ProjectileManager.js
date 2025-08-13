import BasicShot from '../entities/projectiles/basicShot';
import HeavyRounds from '../entities/projectiles/heavyRounds';
import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class ProjectileManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.projectiles = null;
		this.currentWeaponClass = BasicShot;

		this.setupEventListeners();
		this.subscribe(GAME_EVENTS.SCENE_READY, this.setupProjectiles);
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.LETTER_TYPED, this.handleLetterTyped);
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

	handleLetterTyped(data) {
		const { source, target, damage } = data;
		this.fireProjectile(source, target, damage);
	}

	fireProjectile(source, target, damage = 1) {
		const projectile = this.getProjectile();

		if (projectile) {
			projectile.fire(source, target);
			projectile.damage = damage;
			this.emit(GAME_EVENTS.PROJECTILE_FIRED, { projectile, source, target, damage });
			return damage;
		}
		return 0;
	}

	getProjectiles() {
		return this.projectiles;
	}

	getProjectile() {
		if (!this.projectiles) {
			console.warn('ProjectileManager: projectiles not initialized yet');
			return null;
		}

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
