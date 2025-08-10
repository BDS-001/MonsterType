export default class BaseManager {
	constructor(scene) {
		this.scene = scene;
		this.subscriptions = [];
	}

	subscribe(event, callback) {
		this.scene.events.on(event, callback, this);
		this.subscriptions.push({ event, callback, emitter: 'scene' });
	}

	subscribeGame(event, callback) {
		this.scene.game.events.on(event, callback, this);
		this.subscriptions.push({ event, callback, emitter: 'game' });
	}

	emit(event, ...args) {
		this.scene.events.emit(event, ...args);
	}

	emitGame(event, ...args) {
		this.scene.game.events.emit(event, ...args);
	}

	destroy() {
		this.subscriptions.forEach(({ event, callback, emitter }) => {
			if (emitter === 'scene') {
				this.scene.events.off(event, callback, this);
			} else if (emitter === 'game') {
				this.scene.game.events.off(event, callback, this);
			}
		});
		this.subscriptions = [];
	}
}
