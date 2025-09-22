import { TEXT_STYLES } from '../config/fontConfig.js';

export function spawnFloatingText(scene, x, y, text, color = '#ffffff') {
	const style = {
		...TEXT_STYLES.UI_TINY,
		fontSize: '32px',
		strokeThickness: 4,
		fill: color,
	};

	const textObj = scene.add.text(x, y, text, style).setOrigin(0.5, 1).setDepth(2000);
	textObj.setShadow(0, 3, '#000000', 6, true, true);

	scene.tweens.add({
		targets: textObj,
		y: y - 60,
		alpha: 0,
		scale: 1.25,
		duration: 900,
		ease: 'Back.Out',
		onComplete: () => textObj.destroy(),
	});

	return textObj;
}
