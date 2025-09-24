import BasicProjectileAnimation from './BasicProjectileAnimation.js';
import LazerProjectileAnimation from './LazerProjectileAnimation.js';
import ShotgunProjectileAnimation from './ShotgunProjectileAnimation.js';
import CrossbowProjectileAnimation from './CrossbowProjectileAnimation.js';

export default class AnimationFactory {
	constructor(scene) {
		this.scene = scene;
		this.animationTypes = new Map([
			['basic', BasicProjectileAnimation],
			['lazer', LazerProjectileAnimation],
			['shotgun', ShotgunProjectileAnimation],
			['crossbow', CrossbowProjectileAnimation],
		]);
	}

	createAnimation(type, config = {}) {
		const AnimationClass = this.animationTypes.get(type);

		if (!AnimationClass) {
			return this.createAnimation('basic', config);
		}

		return new AnimationClass(this.scene, config);
	}

	registerAnimation(type, AnimationClass) {
		this.animationTypes.set(type, AnimationClass);
	}
}
