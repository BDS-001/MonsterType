import Phaser from 'phaser';
import { TEXT_STYLES } from '../config/fontConfig.js';

export default class fpsCounter extends Phaser.GameObjects.Text {
	constructor(scene, x = 10, y = 10, text = 'FPS: 0') {
		super(scene, x, y, text, TEXT_STYLES.FPS_COUNTER);
		scene.add.existing(this);
		this.scene = scene;
	}

	updateFPS() {
		const currentFps = Math.round(this.scene.game.loop.actualFps);
		this.setText('FPS: ' + currentFps);
	}
}
