import { vi } from 'vitest';

export default function mockPhaser() {
	vi.mock('phaser', () => ({
		default: {
			Scale: {
				FIT: 1,
				CENTER_BOTH: 1,
			},
			Math: {
				Angle: {
					Between: vi.fn((x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1)),
				},
				Distance: {
					Between: vi.fn((x1, y1, x2, y2) => {
						const dx = x2 - x1;
						const dy = y2 - y1;
						return Math.sqrt(dx * dx + dy * dy);
					}),
				},
			},
			Physics: {
				Arcade: {
					Image: class Image {},
					Sprite: class Sprite {
						constructor(scene, x, y, texture) {
							this.scene = scene;
							this.x = x;
							this.y = y;
							this.texture = texture;
							this.displayHeight = 32;
						}
						setScale() {}
						setAlpha() {}
					},
				},
			},
		},
	}));

	global.Phaser = {
		Scale: {
			FIT: 1,
			CENTER_BOTH: 1,
		},
		Math: {
			Angle: {
				Between: vi.fn((x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1)),
			},
			Distance: {
				Between: vi.fn((x1, y1, x2, y2) => {
					const dx = x2 - x1;
					const dy = y2 - y1;
					return Math.sqrt(dx * dx + dy * dy);
				}),
			},
		},
		Physics: {
			Arcade: {
				Image: class Image {},
				Sprite: class Sprite {
					constructor(scene, x, y, texture) {
						this.scene = scene;
						this.x = x;
						this.y = y;
						this.texture = texture;
						this.displayHeight = 32;
					}
					setScale() {}
					setAlpha() {}
				},
			},
		},
	};
}
