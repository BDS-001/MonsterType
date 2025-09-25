export default class Behavior {
	constructor(sprite, config = {}, scene) {
		this.sprite = sprite;
		this.config = config;
		this.scene = scene;
	}

	tick(_dt) {}
}
