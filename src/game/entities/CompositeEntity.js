import TypedEntity from './typedEntity.js';
import { BehaviorRegistry } from '../composition/registry.js';
import Triggers from '../composition/Triggers.js';
import wordBank from '../data/wordbank.js';
import { gameSettings } from '../core/constants.js';

export default class CompositeEntity extends TypedEntity {
	constructor(scene, x, y, definition, id = null) {
		const texture = definition.texture ?? 'enemy';
		const word = CompositeEntity.pickWord(definition);
		super(scene, x, y, texture, word, id);
		const scale = definition.scale ?? gameSettings.SPRITE_SCALE;
		this.setScale(scale);
		this.entityType = definition.entityType ?? 'enemy';
		this.knockback = definition.knockback ?? 10;
		this.damage = definition.damage ?? 10;
		this.dropTable = definition.dropTable ?? [];
		this.tags = new Set();
		this.behaviors = (definition.behaviors ?? [])
			.map((b) => {
				const Ctor = BehaviorRegistry[b.type];
				if (!Ctor) return null;
				return new Ctor(this, b, scene);
			})
			.filter(Boolean);
		this.triggers = new Triggers(definition.triggers ?? {}, scene);
	}

	static pickWord(definition) {
		if (typeof definition.word === 'string') return definition.word;
		if (definition.wordMode === 'letters') {
			const alphabet = definition.letters || 'abcdefghijklmnopqrstuvwxyz';
			const letterCount = Math.max(1, definition.wordLength ?? 1);
			let result = '';
			for (let index = 0; index < letterCount; index++) result += alphabet[Math.floor(Math.random() * alphabet.length)];
			return result;
		}
		const category = definition.wordCategory ?? 'easy';
		const wordList = wordBank[category] ?? wordBank['easy'] ?? ['foo'];
		const index = Math.floor(Math.random() * wordList.length);
		return wordList[index];
	}

	update(time, delta) {
		if (this.isDestroyed) return;
		const deltaSeconds = (delta ?? 16.7) / 1000;
		for (const behavior of this.behaviors) behavior.tick(deltaSeconds);
		this.triggers?.tick?.(deltaSeconds, this);
		super.update(time, delta);
	}

	onKill() {
		this.scene?.events?.emit?.('combat:enemy_killed', { enemy: this, points: 10 });
		if (this.dropTable && this.dropTable.length > 0) {
			const totalWeight = this.dropTable.reduce((sum, entry) => sum + entry.chance, 0);
			const dropRoll = Math.random() * 100;
			if (dropRoll < totalWeight) {
				const itemRoll = Math.random() * totalWeight;
				let currentWeight = 0;
				for (const dropEntry of this.dropTable) {
					currentWeight += dropEntry.chance;
					if (itemRoll <= currentWeight) {
						this.scene?.events?.emit?.('item:item_spawn', {
							x: this.x,
							y: this.y,
							itemType: dropEntry.itemType,
						});
						break;
					}
				}
			}
		}
	}

	isEnemyOnScreen() {
		const camera = this.scene.cameras.main;
		const margin = 50;
		return (
			this.x > camera.scrollX - margin &&
			this.x < camera.scrollX + camera.width + margin &&
			this.y > camera.scrollY - margin &&
			this.y < camera.scrollY + camera.height + margin
		);
	}

	knockbackEnemy() {
		if (this.isDestroyed || this.knockback === 0) return;
		const player = this.scene.player;
		const directionX = player.x - this.x;
		const directionY = player.y - this.y;
		const distance = Math.hypot(directionX, directionY) || 1;
		this.setVelocity((-directionX / distance) * this.knockback, (-directionY / distance) * this.knockback);
		this.isKnockedBack = true;
		this.scene.time.delayedCall(200, () => {
			this.isKnockedBack = false;
		});
	}
}
