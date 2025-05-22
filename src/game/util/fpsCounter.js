import Phaser from 'phaser';

export default class fpsCounter extends Phaser.GameObjects.Text {
	constructor(scene, x = 10, y = 10, text = 'FPS: 0') {
		const FPS_TEXT_STYLE = {
			font: '16px Arial',
			fill: '#00ff00',
		};
		super(scene, x, y, text, FPS_TEXT_STYLE);
		scene.add.existing(this);
		this.isCustomText = true;

		this.scene = scene;
		this.fpsText = null;
	}

	updateFPS() {
		this.setText('FPS: ' + Math.round(this.scene.game.loop.actualFps));
	}
}
