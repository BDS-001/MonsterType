import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';
import AnimationFactory from '../animations/AnimationFactory.js';
import { shakeCamera } from '../util/cameraEffects.js';

export default class AttackAnimationManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.animationFactory = new AnimationFactory(scene);
		this.subscribe(GAME_EVENTS.WEAPON_FIRED, this.fireProjectile);
	}

	fireProjectile(data) {
		const animationType = this.determineAnimationType(data);
		if (!animationType) return;

		const animation = this.animationFactory.createAnimation(animationType);
		animation.animate(data);

		shakeCamera(this.scene);
	}

	determineAnimationType(data) {
		const { weapon } = data;
		return weapon?.attackAnimation;
	}
}
