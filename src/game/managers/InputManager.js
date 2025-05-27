export default class InputManager {
    constructor(scene) {
        this.scene = scene
        this.currentKey = null;
        this.setupKeyboardInput()
    }

    setupKeyboardInput() {
		this.scene.input.keyboard.on('keydown', (event) => {
			this.currentKey = event.key;
            console.log(event.key)
		});
	}

    getCurrentKey() {
        return this.currentKey
    }

    update() {
        this.currentKey = null
    }
}