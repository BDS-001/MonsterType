import Phaser from 'phaser';

export default class fpsCounter extends Phaser.GameObjects.Text {
	constructor(scene, x = 10, y = 10, text = 'FPS: 0') {
		const FPS_TEXT_STYLE = {
			font: '16px "Press Start 2P"',
			fill: '#00ff00',
		};

		super(scene, x, y, text, FPS_TEXT_STYLE);
		scene.add.existing(this);
		this.scene = scene;
	}

	updateFPS() {
		const currentFps = Math.round(this.scene.game.loop.actualFps);
		this.setText('FPS: ' + currentFps);
	}
}
