import Phaser from 'phaser';

export function createActionHandlers(resolveGameEvent, runAction) {
	return {
		SpawnProjectile(sprite, config, scene) {
			const projectileCount = config.count ?? 1;
			const angleSpread = config.spread ?? 0;
			const targetX = scene?.player?.x ?? sprite.x;
			const targetY = scene?.player?.y ?? sprite.y;
			const baseAngle = Phaser.Math.Angle.Between(sprite.x, sprite.y, targetX, targetY);
			for (let index = 0; index < projectileCount; index++) {
				const angleOffset = (index - (projectileCount - 1) / 2) * angleSpread;
				const projectile = scene?.physics?.add?.sprite?.(sprite.x, sprite.y, 'basicShot');
				projectile?.setVelocity(
					Math.cos(baseAngle + angleOffset) * (config.speed ?? 500),
					Math.sin(baseAngle + angleOffset) * (config.speed ?? 500)
				);
			}
		},
		IfTag(sprite, config, scene) {
			if (!config?.tag) return;
			if (sprite.tags?.has?.(config.tag)) {
				for (const action of config.then ?? []) runAction(action, sprite, scene);
			}
		},
		EmitEvent(_sprite, config, scene) {
			const eventName = resolveGameEvent(config.event);
			if (!eventName) return;
			scene?.events?.emit?.(eventName, config.payload ?? {});
		},
		HealPlayer(_sprite, config, scene) {
			const amt = config.amount ?? 0;
			scene?.stateManager?.playerHeal?.({ amount: amt });
		},
		ApplyShield(_sprite, config, scene) {
			const amt = config.amount ?? 0;
			scene?.stateManager?.applyShield?.({ amount: amt });
		},
		AreaDamage(sprite, config, scene) {
			const damageRadius = config.radius ?? 200;
			const damageAmount = config.damage ?? 10;
			const graphics = scene?.add?.graphics();
			if (graphics) {
				graphics.setPosition(sprite.x, sprite.y);
				graphics.lineStyle(3, 0xff0000, 0.8);
				graphics.fillStyle(0xff0000, 0.3);
				graphics.fillCircle(0, 0, damageRadius);
				graphics.strokeCircle(0, 0, damageRadius);
				scene.tweens.add({ targets: graphics, alpha: 0, duration: 300, ease: 'Power2', onComplete: () => graphics.destroy() });
			}
			const overlapBodies = scene?.physics?.overlapCirc?.(sprite.x, sprite.y, damageRadius, true, false) ?? [];
			const validBodies = overlapBodies.filter((entry) => ['item', 'enemy'].includes(entry?.gameObject?.entityType));
			for (const entry of validBodies) entry?.gameObject?.takeDamage?.(damageAmount);
		},
	};
}
