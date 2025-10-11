import TypedEntity from '../entities/typedEntity';

export function isTypedEntity(obj) {
	return obj instanceof TypedEntity;
}

export function getTypedEntitiesInRadius(scene, x, y, radius, predicate = null) {
	const bodies = scene.physics.overlapCirc(x, y, radius, true, false);
	const out = [];
	for (const body of bodies) {
		const obj = body.gameObject;
		if (!obj) continue;
		if (!(obj instanceof TypedEntity)) continue;
		if (predicate && !predicate(obj)) continue;
		out.push(obj);
	}
	return out;
}

export function getDamageableEnemiesInRadius(scene, x, y, radius) {
	return getTypedEntitiesInRadius(
		scene,
		x,
		y,
		radius,
		(obj) => obj.entityType === 'enemy' && typeof obj.takeDamage === 'function'
	);
}
