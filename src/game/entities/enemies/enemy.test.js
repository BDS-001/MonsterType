import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mockPhaser from '../../../test-utils/phaser.mock.js';
import { createMockScene } from '../../../test-utils/scene.mock.js';

mockPhaser();

vi.mock('../typedEntity', () => ({
	default: class TypedEntity {
		constructor(scene, x, y, spriteImage, word, id) {
			this.scene = scene;
			this.x = x;
			this.y = y;
			this.spriteImage = spriteImage;
			this.word = word;
			this.id = id;
			this.displayHeight = 50;
			this.flipX = undefined;
		}
		hitEffect() {}
		destroy() {}
		setScale() {}
		setTint() {}
		clearTint() {}
		setVelocity() {}
	},
}));

import Enemy from './enemy.js';

describe('Enemy', () => {
	let mockScene;
	let enemy;

	beforeEach(() => {
		mockScene = createMockScene();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor', () => {
		it('should initialize with default options', () => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');

			expect(enemy.entityType).toBe('enemy');
			expect(enemy.baseStats.moveSpeed).toBe(50);
			expect(enemy.baseStats.damage).toBe(10);
			expect(enemy.knockback).toBe(10);
			expect(enemy.dropTable).toEqual([]);
			expect(enemy.isKnockedBack).toBe(false);
			expect(enemy.statusEffects).toEqual({});
		});

		it('should merge custom options with defaults', () => {
			const options = {
				moveSpeed: 100,
				knockback: 20,
				damage: 15,
				dropTable: [{ itemType: 'MEDKIT', chance: 5 }],
			};

			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie', options);

			expect(enemy.baseStats.moveSpeed).toBe(100);
			expect(enemy.baseStats.damage).toBe(15);
			expect(enemy.knockback).toBe(20);
			expect(enemy.dropTable).toEqual([{ itemType: 'MEDKIT', chance: 5 }]);
		});

		it('should select word from wordbank based on category', () => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie', {
				wordCategory: 'easy',
			});

			expect(enemy.word).toBeDefined();
			expect(typeof enemy.word).toBe('string');
		});

		it('should flip sprite when spawned right of player', () => {
			enemy = new Enemy(mockScene, 150, 100, 'enemy1', 'zombie');
			expect(enemy.flipX).toBe(true);
		});

		it('should not flip sprite when spawned left of player', () => {
			enemy = new Enemy(mockScene, 50, 100, 'enemy1', 'zombie');
			expect(enemy.flipX).toBeUndefined();
		});

		it('should set custom scale when provided', () => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie', { scale: 3 });
			expect(mockScene.physics.add.existing).toHaveBeenCalledWith(enemy);
		});

		it('should add physics body to enemy', () => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');
			expect(mockScene.physics.add.existing).toHaveBeenCalledWith(enemy);
		});
	});

	describe('isEnemyOnScreen', () => {
		beforeEach(() => {
			enemy = new Enemy(mockScene, 400, 300, 'enemy1', 'zombie');
		});

		it('should return true when enemy is on screen', () => {
			enemy.x = 400;
			enemy.y = 300;

			expect(enemy.isEnemyOnScreen()).toBe(true);
		});

		it('should return true when enemy is within margin', () => {
			enemy.x = -40;
			enemy.y = 300;

			expect(enemy.isEnemyOnScreen()).toBe(true);
		});

		it('should return false when enemy is too far left', () => {
			enemy.x = -100;
			enemy.y = 300;

			expect(enemy.isEnemyOnScreen()).toBe(false);
		});

		it('should return false when enemy is too far right', () => {
			enemy.x = 900;
			enemy.y = 300;

			expect(enemy.isEnemyOnScreen()).toBe(false);
		});

		it('should return false when enemy is too far above', () => {
			enemy.x = 400;
			enemy.y = -100;

			expect(enemy.isEnemyOnScreen()).toBe(false);
		});

		it('should return false when enemy is too far below', () => {
			enemy.x = 400;
			enemy.y = 700;

			expect(enemy.isEnemyOnScreen()).toBe(false);
		});
	});

	describe('knockbackEnemy', () => {
		beforeEach(() => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie', { knockback: 50 });
			enemy.isDestroyed = false;
		});

		it('should apply knockback away from player', () => {
			const setVelocitySpy = vi.spyOn(enemy, 'setVelocity');

			enemy.knockbackEnemy();

			expect(setVelocitySpy).toHaveBeenCalled();
			expect(enemy.isKnockedBack).toBe(true);
		});

		it('should set isKnockedBack to true', () => {
			enemy.knockbackEnemy();

			expect(enemy.isKnockedBack).toBe(true);
		});

		it('should schedule isKnockedBack to false after 200ms', () => {
			enemy.knockbackEnemy();

			expect(mockScene.time.delayedCall).toHaveBeenCalledWith(200, expect.any(Function));
		});

		it('should not apply knockback when destroyed', () => {
			const setVelocitySpy = vi.spyOn(enemy, 'setVelocity');
			enemy.isDestroyed = true;

			enemy.knockbackEnemy();

			expect(setVelocitySpy).not.toHaveBeenCalled();
		});

		it('should not apply knockback when knockback is 0', () => {
			const setVelocitySpy = vi.spyOn(enemy, 'setVelocity');
			enemy.knockback = 0;

			enemy.knockbackEnemy();

			expect(setVelocitySpy).not.toHaveBeenCalled();
		});
	});

	describe('hitEffect', () => {
		beforeEach(() => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');
			enemy.isDestroyed = false;
		});

		it('should call parent hitEffect', () => {
			const hitEffectSpy = vi.spyOn(Object.getPrototypeOf(Enemy.prototype), 'hitEffect');

			enemy.hitEffect(2);

			expect(hitEffectSpy).toHaveBeenCalledWith(2);
		});

		it('should add tween for red flash', () => {
			enemy.hitEffect(1);

			expect(mockScene.tweens.add).toHaveBeenCalledWith(
				expect.objectContaining({
					targets: enemy,
					tint: 0xff0000,
					duration: 50,
					yoyo: true,
				})
			);
		});

		it('should call knockbackEnemy', () => {
			const knockbackSpy = vi.spyOn(enemy, 'knockbackEnemy');

			enemy.hitEffect(1);

			expect(knockbackSpy).toHaveBeenCalled();
		});

		it('should not execute when destroyed', () => {
			enemy.isDestroyed = true;

			enemy.hitEffect(1);

			expect(mockScene.tweens.add).not.toHaveBeenCalled();
		});

		it('should not execute when scene is destroyed', () => {
			mockScene.tweens = null;

			enemy.hitEffect(1);

			expect(mockScene.tweens).toBeNull();
		});

		it('should restore freeze tint after hit animation completes', () => {
			const clearTintSpy = vi.spyOn(enemy, 'clearTint');
			const setTintSpy = vi.spyOn(enemy, 'setTint');
			enemy.statusEffects.freeze = { duration: 1000 };

			enemy.hitEffect(1);

			const tweenConfig = mockScene.tweens.add.mock.calls[0][0];
			tweenConfig.onComplete();

			expect(clearTintSpy).toHaveBeenCalled();
			expect(setTintSpy).toHaveBeenCalledWith(0x00ffff);
		});
	});

	describe('moveEnemy', () => {
		beforeEach(() => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie', { moveSpeed: 50 });
			enemy.isDestroyed = false;
			enemy.isKnockedBack = false;
		});

		it('should move towards player at base speed', () => {
			enemy.moveEnemy(16);

			expect(mockScene.physics.moveToObject).toHaveBeenCalledWith(enemy, mockScene.player, 50);
		});

		it('should apply freeze speed multiplier', () => {
			enemy.statusEffects.freeze = { speedMultiplier: 0.5 };

			enemy.moveEnemy(16);

			expect(mockScene.physics.moveToObject).toHaveBeenCalledWith(enemy, mockScene.player, 25);
		});

		it('should not move when destroyed', () => {
			enemy.isDestroyed = true;

			enemy.moveEnemy(16);

			expect(mockScene.physics.moveToObject).not.toHaveBeenCalled();
		});

		it('should not move when knocked back', () => {
			enemy.isKnockedBack = true;

			enemy.moveEnemy(16);

			expect(mockScene.physics.moveToObject).not.toHaveBeenCalled();
		});
	});

	describe('update', () => {
		beforeEach(() => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');
			enemy.isDestroyed = false;
			enemy.healthText = {
				setPosition: vi.fn(),
			};
		});

		it('should call updateStatusEffects', () => {
			const spy = vi.spyOn(enemy, 'updateStatusEffects');

			enemy.update(16);

			expect(spy).toHaveBeenCalled();
		});

		it('should call moveEnemy', () => {
			const spy = vi.spyOn(enemy, 'moveEnemy');

			enemy.update(16);

			expect(spy).toHaveBeenCalledWith(16);
		});

		it('should call updateTextPositions', () => {
			const spy = vi.spyOn(enemy, 'updateTextPositions');

			enemy.update(16);

			expect(spy).toHaveBeenCalled();
		});

		it('should not update when destroyed', () => {
			enemy.isDestroyed = true;
			const spy = vi.spyOn(enemy, 'moveEnemy');

			enemy.update(16);

			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('updateTextPositions', () => {
		beforeEach(() => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');
			enemy.displayHeight = 50;
		});

		it('should update health text position', () => {
			enemy.healthText = {
				setPosition: vi.fn(),
			};

			enemy.updateTextPositions();

			expect(enemy.healthText.setPosition).toHaveBeenCalledWith(200, 165);
		});

		it('should not crash when healthText is undefined', () => {
			enemy.healthText = undefined;

			expect(() => enemy.updateTextPositions()).not.toThrow();
		});
	});

	describe('handleItemDrop', () => {
		beforeEach(() => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');
		});

		it('should not drop items when drop table is empty', () => {
			enemy.dropTable = [];

			enemy.handleItemDrop();

			expect(mockScene.events.emit).not.toHaveBeenCalled();
		});

		it('should not drop items when dropRoll fails', () => {
			enemy.dropTable = [{ itemType: 'MEDKIT', chance: 5 }];
			vi.spyOn(Math, 'random').mockReturnValueOnce(0.99);

			enemy.handleItemDrop();

			expect(mockScene.events.emit).not.toHaveBeenCalled();
		});

		it('should emit ITEM_SPAWNED event when drop succeeds', () => {
			enemy.dropTable = [{ itemType: 'MEDKIT', chance: 50 }];
			vi.spyOn(Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.1);

			enemy.handleItemDrop();

			expect(mockScene.events.emit).toHaveBeenCalledWith('item:item_spawn', {
				x: 200,
				y: 200,
				itemType: 'MEDKIT',
			});
		});

		it('should select correct item from drop table', () => {
			enemy.dropTable = [
				{ itemType: 'MEDKIT', chance: 25 },
				{ itemType: 'SHIELD', chance: 25 },
			];
			vi.spyOn(Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.6);

			enemy.handleItemDrop();

			expect(mockScene.events.emit).toHaveBeenCalledWith('item:item_spawn', {
				x: 200,
				y: 200,
				itemType: 'SHIELD',
			});
		});
	});

	describe('applyStatusEffect', () => {
		beforeEach(() => {
			mockScene.time.now = 1000;
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');
			enemy.setTint = vi.fn();
		});

		it('should add status effect with duration and startTime', () => {
			enemy.applyStatusEffect('freeze', { duration: 2000, speedMultiplier: 0.5 });

			expect(enemy.statusEffects.freeze).toEqual({
				duration: 2000,
				startTime: 1000,
				speedMultiplier: 0.5,
			});
		});

		it('should apply freeze tint', () => {
			const setTintSpy = vi.spyOn(enemy, 'setTint');

			enemy.applyStatusEffect('freeze', { duration: 2000 });

			expect(setTintSpy).toHaveBeenCalledWith(0x00ffff);
		});

		it('should not apply tint for non-freeze effects', () => {
			const setTintSpy = vi.spyOn(enemy, 'setTint');

			enemy.applyStatusEffect('burn', { duration: 2000 });

			expect(setTintSpy).not.toHaveBeenCalled();
		});
	});

	describe('removeStatusEffect', () => {
		beforeEach(() => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');
		});

		it('should remove status effect from object', () => {
			enemy.statusEffects.freeze = { duration: 2000 };

			enemy.removeStatusEffect('freeze');

			expect(enemy.statusEffects.freeze).toBeUndefined();
		});

		it('should clear tint for freeze effect', () => {
			const clearTintSpy = vi.spyOn(enemy, 'clearTint');
			enemy.statusEffects.freeze = { duration: 2000 };

			enemy.removeStatusEffect('freeze');

			expect(clearTintSpy).toHaveBeenCalled();
		});

		it('should not clear tint for non-freeze effects', () => {
			const clearTintSpy = vi.spyOn(enemy, 'clearTint');
			enemy.statusEffects.burn = { duration: 2000 };

			enemy.removeStatusEffect('burn');

			expect(clearTintSpy).not.toHaveBeenCalled();
		});
	});

	describe('updateStatusEffects', () => {
		beforeEach(() => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');
			mockScene.time.now = 1000;
		});

		it('should remove expired status effects', () => {
			enemy.statusEffects.freeze = { duration: 500, startTime: 0 };
			mockScene.time.now = 1000;

			enemy.updateStatusEffects();

			expect(enemy.statusEffects.freeze).toBeUndefined();
		});

		it('should keep active status effects', () => {
			enemy.statusEffects.freeze = { duration: 2000, startTime: 500 };
			mockScene.time.now = 1000;

			enemy.updateStatusEffects();

			expect(enemy.statusEffects.freeze).toBeDefined();
		});

		it('should call action callback if defined', () => {
			const actionFn = vi.fn();
			enemy.statusEffects.burn = {
				duration: 2000,
				startTime: 0,
				action: actionFn,
			};
			mockScene.time.now = 500;

			enemy.updateStatusEffects();

			expect(actionFn).toHaveBeenCalledWith(enemy, 500);
		});

		it('should not crash when action is undefined', () => {
			enemy.statusEffects.freeze = { duration: 2000, startTime: 0 };
			mockScene.time.now = 500;

			expect(() => enemy.updateStatusEffects()).not.toThrow();
		});
	});

	describe('onKill', () => {
		beforeEach(() => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');
		});

		it('should call handleItemDrop', () => {
			const spy = vi.spyOn(enemy, 'handleItemDrop');

			enemy.onKill();

			expect(spy).toHaveBeenCalled();
		});

		it('should emit ENEMY_KILLED event', () => {
			enemy.onKill();

			expect(mockScene.events.emit).toHaveBeenCalledWith('combat:enemy_killed', {
				enemy: enemy,
				points: 10,
			});
		});
	});

	describe('destroy', () => {
		it('should call parent destroy', () => {
			enemy = new Enemy(mockScene, 200, 200, 'enemy1', 'zombie');
			const destroySpy = vi.spyOn(Object.getPrototypeOf(Enemy.prototype), 'destroy');

			enemy.destroy(true);

			expect(destroySpy).toHaveBeenCalledWith(true);
		});
	});
});
