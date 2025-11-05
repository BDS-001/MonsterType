import { describe, it, expect, vi, beforeEach } from 'vitest';
import StateManager from './StateManager';
import { createMockScene } from '../../test-utils/scene.mock';
import { GAME_EVENTS } from '../core/GameEvents';

vi.mock('../core/BaseManager.js', () => {
	return {
		default: class BaseManager {
			constructor(scene) {
				this.scene = scene;
			}
			subscribe = vi.fn();
			emit = vi.fn();
			subscribeGame = vi.fn();
			emitGame = vi.fn();
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

    it('should subscribe to correct events', () => {
        expect(stateManager.subscribe).toHaveBeenCalledWith(GAME_EVENTS.ENEMY_KILLED, stateManager.handleEnemyKilled);
        expect(stateManager.subscribe).toHaveBeenCalledWith(GAME_EVENTS.PLAYER_HIT, stateManager.playerHit);
        expect(stateManager.subscribeGame).toHaveBeenCalledWith(GAME_EVENTS.MULTIPLIER_CHANGED, stateManager.handleMultiplierChanged);
        expect(stateManager.subscribeGame).toHaveBeenCalledWith(GAME_EVENTS.GAME_OVER, stateManager.handleGameRestart);
    })
});
