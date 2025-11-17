import { describe, it, expect, vi, beforeEach } from 'vitest';
import BaseManager from './BaseManager';
import { createMockScene } from '../../test-utils/scene.mock';

describe('BaseManager', () => {
	let baseManager;
	let scene;

	beforeEach(() => {
		scene = createMockScene();
		baseManager = new BaseManager(scene);
	});

	describe('constructor', () => {
		it('should initialize with scene reference', () => {
			expect(baseManager.scene).toBe(scene);
		});

		it('should initialize subscriptions as empty array', () => {
			expect(baseManager.subscriptions).toEqual([]);
			expect(Array.isArray(baseManager.subscriptions)).toBe(true);
		});
	});

	describe('subscribe', () => {
		it('should subscribe to scene events', () => {
			const callback = vi.fn();
			const event = 'test:event';

			baseManager.subscribe(event, callback);

			expect(scene.events.on).toHaveBeenCalledWith(event, callback, baseManager);
		});

		it('should add subscription to subscriptions array', () => {
			const callback = vi.fn();
			const event = 'test:event';

			baseManager.subscribe(event, callback);

			expect(baseManager.subscriptions).toHaveLength(1);
			expect(baseManager.subscriptions[0]).toEqual({
				event: 'test:event',
				callback,
				emitter: 'scene',
			});
		});

		it('should handle multiple subscriptions', () => {
			const callback1 = vi.fn();
			const callback2 = vi.fn();

			baseManager.subscribe('event1', callback1);
			baseManager.subscribe('event2', callback2);

			expect(baseManager.subscriptions).toHaveLength(2);
			expect(scene.events.on).toHaveBeenCalledTimes(2);
		});
	});

	describe('subscribeGame', () => {
		it('should subscribe to game events', () => {
			const callback = vi.fn();
			const event = 'test:game:event';

			baseManager.subscribeGame(event, callback);

			expect(scene.game.events.on).toHaveBeenCalledWith(event, callback, baseManager);
		});

		it('should add subscription to subscriptions array with game emitter', () => {
			const callback = vi.fn();
			const event = 'test:game:event';

			baseManager.subscribeGame(event, callback);

			expect(baseManager.subscriptions).toHaveLength(1);
			expect(baseManager.subscriptions[0]).toEqual({
				event: 'test:game:event',
				callback,
				emitter: 'game',
			});
		});

		it('should handle multiple game subscriptions', () => {
			const callback1 = vi.fn();
			const callback2 = vi.fn();

			baseManager.subscribeGame('game:event1', callback1);
			baseManager.subscribeGame('game:event2', callback2);

			expect(baseManager.subscriptions).toHaveLength(2);
			expect(scene.game.events.on).toHaveBeenCalledTimes(2);
		});
	});

	describe('emit', () => {
		it('should emit events to scene event emitter', () => {
			const event = 'test:event';

			baseManager.emit(event);

			expect(scene.events.emit).toHaveBeenCalledWith(event);
		});

		it('should pass arguments to scene event emitter', () => {
			const event = 'test:event';
			const arg1 = { data: 'value1' };
			const arg2 = 'value2';
			const arg3 = 42;

			baseManager.emit(event, arg1, arg2, arg3);

			expect(scene.events.emit).toHaveBeenCalledWith(event, arg1, arg2, arg3);
		});

		it('should handle emit with no arguments', () => {
			const event = 'test:event';

			baseManager.emit(event);

			expect(scene.events.emit).toHaveBeenCalledWith(event);
		});
	});

	describe('emitGame', () => {
		it('should emit events to game event emitter', () => {
			const event = 'test:game:event';

			baseManager.emitGame(event);

			expect(scene.game.events.emit).toHaveBeenCalledWith(event);
		});

		it('should pass arguments to game event emitter', () => {
			const event = 'test:game:event';
			const arg1 = { data: 'value1' };
			const arg2 = 'value2';
			const arg3 = 42;

			baseManager.emitGame(event, arg1, arg2, arg3);

			expect(scene.game.events.emit).toHaveBeenCalledWith(event, arg1, arg2, arg3);
		});

		it('should handle emitGame with no arguments', () => {
			const event = 'test:game:event';

			baseManager.emitGame(event);

			expect(scene.game.events.emit).toHaveBeenCalledWith(event);
		});
	});

	describe('destroyGroup', () => {
		it('should destroy group when valid', () => {
			const mockGroup = {
				scene: {
					sys: {
						isDestroyed: false,
					},
				},
				destroy: vi.fn(),
			};

			baseManager.destroyGroup(mockGroup);

			expect(mockGroup.destroy).toHaveBeenCalledWith(true);
		});

		it('should not destroy group if scene is destroyed', () => {
			const mockGroup = {
				scene: {
					sys: {
						isDestroyed: true,
					},
				},
				destroy: vi.fn(),
			};

			baseManager.destroyGroup(mockGroup);

			expect(mockGroup.destroy).not.toHaveBeenCalled();
		});

		it('should handle null group gracefully', () => {
			expect(() => baseManager.destroyGroup(null)).not.toThrow();
		});

		it('should handle undefined group gracefully', () => {
			expect(() => baseManager.destroyGroup(undefined)).not.toThrow();
		});

		it('should handle group without scene', () => {
			const mockGroup = {
				destroy: vi.fn(),
			};

			expect(() => baseManager.destroyGroup(mockGroup)).not.toThrow();
			expect(mockGroup.destroy).not.toHaveBeenCalled();
		});

		it('should throw error when group has scene but no sys', () => {
			const mockGroup = {
				scene: {},
				destroy: vi.fn(),
			};

			expect(() => baseManager.destroyGroup(mockGroup)).toThrow();
		});
	});

	describe('destroy', () => {
		it('should unsubscribe from all scene events', () => {
			const callback1 = vi.fn();
			const callback2 = vi.fn();

			baseManager.subscribe('event1', callback1);
			baseManager.subscribe('event2', callback2);

			baseManager.destroy();

			expect(scene.events.off).toHaveBeenCalledWith('event1', callback1, baseManager);
			expect(scene.events.off).toHaveBeenCalledWith('event2', callback2, baseManager);
		});

		it('should unsubscribe from all game events', () => {
			const callback1 = vi.fn();
			const callback2 = vi.fn();

			baseManager.subscribeGame('game:event1', callback1);
			baseManager.subscribeGame('game:event2', callback2);

			baseManager.destroy();

			expect(scene.game.events.off).toHaveBeenCalledWith('game:event1', callback1, baseManager);
			expect(scene.game.events.off).toHaveBeenCalledWith('game:event2', callback2, baseManager);
		});

		it('should unsubscribe from mixed scene and game events', () => {
			const sceneCallback = vi.fn();
			const gameCallback = vi.fn();

			baseManager.subscribe('scene:event', sceneCallback);
			baseManager.subscribeGame('game:event', gameCallback);

			baseManager.destroy();

			expect(scene.events.off).toHaveBeenCalledWith('scene:event', sceneCallback, baseManager);
			expect(scene.game.events.off).toHaveBeenCalledWith('game:event', gameCallback, baseManager);
		});

		it('should clear subscriptions array', () => {
			baseManager.subscribe('event1', vi.fn());
			baseManager.subscribeGame('event2', vi.fn());

			expect(baseManager.subscriptions).toHaveLength(2);

			baseManager.destroy();

			expect(baseManager.subscriptions).toEqual([]);
		});

		it('should handle destroy when no subscriptions exist', () => {
			expect(() => baseManager.destroy()).not.toThrow();
			expect(baseManager.subscriptions).toEqual([]);
		});

		it('should not throw error if called multiple times', () => {
			baseManager.subscribe('event1', vi.fn());

			expect(() => {
				baseManager.destroy();
				baseManager.destroy();
				baseManager.destroy();
			}).not.toThrow();

			expect(baseManager.subscriptions).toEqual([]);
		});
	});

	describe('integration tests', () => {
		it('should properly manage lifecycle of multiple subscriptions', () => {
			const sceneCallback1 = vi.fn();
			const sceneCallback2 = vi.fn();
			const gameCallback1 = vi.fn();
			const gameCallback2 = vi.fn();

			// Subscribe to multiple events
			baseManager.subscribe('scene:event1', sceneCallback1);
			baseManager.subscribe('scene:event2', sceneCallback2);
			baseManager.subscribeGame('game:event1', gameCallback1);
			baseManager.subscribeGame('game:event2', gameCallback2);

			// Verify all subscriptions were added
			expect(baseManager.subscriptions).toHaveLength(4);
			expect(scene.events.on).toHaveBeenCalledTimes(2);
			expect(scene.game.events.on).toHaveBeenCalledTimes(2);

			// Destroy and verify cleanup
			baseManager.destroy();

			expect(scene.events.off).toHaveBeenCalledTimes(2);
			expect(scene.game.events.off).toHaveBeenCalledTimes(2);
			expect(baseManager.subscriptions).toEqual([]);
		});

		it('should maintain correct context when emitting', () => {
			const eventName = 'test:event';
			const data = { value: 42 };

			baseManager.emit(eventName, data);
			baseManager.emitGame(eventName, data);

			expect(scene.events.emit).toHaveBeenCalledWith(eventName, data);
			expect(scene.game.events.emit).toHaveBeenCalledWith(eventName, data);
		});
	});
});
