import Phaser from 'phaser';
import { GAME_EVENTS } from '../core/GameEvents.js';

function emitFired(scene, weapon, target, extra = {}, originX, originY) {
  scene?.events?.emit?.(GAME_EVENTS.WEAPON_FIRED, {
    target,
    weapon,
    originX,
    originY,
    ...extra,
  });
}

export const WeaponActionRegistry = {
  BasicShot(playerSprite, config, scene, weapon, fireData) {
    const { targets, originX, originY } = fireData;
    for (const target of targets) {
      target?.takeDamage?.(config.damage ?? 1);
      emitFired(scene, weapon, target, {}, originX, originY);
    }
  },

  RicochetShot(playerSprite, config, scene, weapon, fireData) {
    const primary = fireData.targets?.[0];
    if (!primary || !scene?.physics) return;
    const range = config.range ?? 300;
    let remaining = config.ricochetCount ?? 3;
    const visited = new Set([primary]);

    let currentX = primary.x;
    let currentY = primary.y;

    primary.takeDamage?.(config.damage ?? 1);
    emitFired(scene, weapon, primary, {}, fireData.originX, fireData.originY);

    while (remaining > 0) {
      const bodies = scene.physics.overlapCirc(currentX, currentY, range, true, false) || [];
      let closest = null;
      let closestDist = Infinity;
      for (const body of bodies) {
        const candidate = body.gameObject;
        if (!candidate?.takeDamage || visited.has(candidate)) continue;
        const dist = (candidate.x - currentX) ** 2 + (candidate.y - currentY) ** 2;
        if (dist < closestDist) {
          closestDist = dist;
          closest = candidate;
        }
      }
      if (!closest) break;
      closest.takeDamage?.(config.damage ?? 1);
      emitFired(scene, weapon, closest, {}, currentX, currentY);
      visited.add(closest);
      currentX = closest.x;
      currentY = closest.y;
      remaining--;
    }
  },

  ShotgunCone(playerSprite, config, scene, weapon, fireData) {
    const primary = fireData.targets?.[0];
    const player = playerSprite;
    if (!primary || !player || !scene?.physics) return;

    const halfAngle = config.halfAngle ?? 0.6;
    const maxRange = config.maxRange ?? 1200;
    const pelletFxCount = config.pelletFxCount ?? 16;

    primary.takeDamage?.(config.damage ?? 1);

    const bodies = scene.physics.overlapCirc(player.x, player.y, maxRange, true, false) || [];
    const dx = primary.x - player.x;
    const dy = primary.y - player.y;
    const dirLenSq = dx * dx + dy * dy;
    if (dirLenSq > 0) {
      const invDirLen = 1 / Math.sqrt(dirLenSq);
      const dirX = dx * invDirLen;
      const dirY = dy * invDirLen;
      const cosThreshSq = Math.cos(halfAngle) ** 2;
      for (const body of bodies) {
        const target = body.gameObject;
        if (!target?.takeDamage || target === primary) continue;
        const ex = target.x - player.x;
        const ey = target.y - player.y;
        const distSq = ex * ex + ey * ey;
        if (distSq === 0) continue;
        const dot = dirX * ex + dirY * ey;
        if (dot <= 0) continue;
        if (dot * dot >= cosThreshSq * distSq) target.takeDamage?.(config.damage ?? 1);
      }
    }

    emitFired(scene, weapon, primary, { pelletFxCount, halfAngle, maxRange }, player.x, player.y);
  },

  LazerLine(playerSprite, config, scene, weapon, fireData) {
    const primary = fireData.targets?.[0];
    const player = playerSprite;
    if (!primary || !player || !scene?.physics) return;

    const beamLength = config.length ?? 1500;
    const beamWidth = config.width ?? 60;

    primary.takeDamage?.(config.damage ?? 1);

    const bodies = scene.physics.overlapCirc(player.x, player.y, beamLength, true, false) || [];
    const angle = Phaser.Math.Angle.Between(player.x, player.y, primary.x, primary.y);
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);

    for (const body of bodies) {
      const target = body.gameObject;
      if (!target?.takeDamage || target === primary) continue;
      const toTargetX = target.x - player.x;
      const toTargetY = target.y - player.y;
      const dot = toTargetX * dirX + toTargetY * dirY;
      if (dot <= 0) continue;
      const distanceToBeam = Math.abs(toTargetX * dirY - toTargetY * dirX);
      if (distanceToBeam <= beamWidth) target.takeDamage?.(config.damage ?? 1);
    }

    emitFired(scene, weapon, primary, { lazerLength: beamLength, lazerWidth: beamWidth }, player.x, player.y);
  },
};

export function runWeaponAction(action, playerSprite, scene, weapon, fireData) {
  const fn = WeaponActionRegistry[action.type];
  if (!fn) return;
  return fn(playerSprite, action, scene, weapon, fireData);
}
