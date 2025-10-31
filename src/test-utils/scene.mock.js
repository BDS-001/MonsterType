import { vi } from 'vitest';

export const createMockScene = (overrides = {}) => {
	return {
		player: { x: 100, y: 100 },
		physics: {
			add: {
				existing: vi.fn(),
			},
			moveToObject: vi.fn(),
		},
		time: {
			now: 1000,
			delayedCall: vi.fn(),
		},
		cameras: {
			main: {
				scrollX: 0,
				scrollY: 0,
				width: 800,
				height: 600,
			},
		},
		tweens: {
			add: vi.fn(),
		},
		events: {
			emit: vi.fn(),
			on: vi.fn(),
			off: vi.fn(),
		},
		add: {
			existing: vi.fn(),
			group: vi.fn(),
			text: vi.fn(() => ({
				setOrigin: vi.fn(),
				setPosition: vi.fn(),
				setText: vi.fn(),
				destroy: vi.fn(),
			})),
		},
		...overrides,
	};
};
