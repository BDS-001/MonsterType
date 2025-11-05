import { describe, it, expect, vi, beforeEach } from 'vitest';
import StateManager from './StateManager';
import { createMockScene } from '../../test-utils/scene.mock';

vi.mock('../core/BaseManager.js', () => {
	return {
		default: class BaseManager {
			constructor(scene) {
				this.scene = scene;
			}
			subscribe() {}
			emit() {}
			subscribeGame() {}
		},
	};
});

describe('StateManager', () => {
	let stateManager;
	let scene;
	beforeEach(() => {
		scene = createMockScene();
		stateManager = new StateManager(scene);
	});

	it('should initialize with correct properties', () => {
		expect(stateManager.scene).toBe(scene);
	});

	it('should initialize with correct function calls', () => {
		const reset = vi.spyOn(StateManager.prototype, 'resetState');
		const setupListeners = vi.spyOn(StateManager.prototype, 'setupEventListeners');
		new StateManager(scene);
		expect(reset).toHaveBeenCalled();
		expect(setupListeners).toHaveBeenCalled();
	});
});
