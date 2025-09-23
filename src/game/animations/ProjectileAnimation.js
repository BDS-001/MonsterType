export default class ProjectileAnimation {
	constructor(scene) {
		this.scene = scene;
	}

	animate(data) {
		throw new Error('animate method must be implemented by subclass');
	}

	getPlayer() {
		return this.scene.player;
	}

	validateData(data) {
		const { target, originX, originY } = data;

		if (originX == null || originY == null) return false;
		if (!target || target.x == null || target.y == null) return false;

		return true;
	}
}
