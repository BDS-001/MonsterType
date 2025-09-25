import CompositeEntity from './CompositeEntity.js';

function randomEdgeSpawn(camera, margin = 100) {
	const { width, height } = camera;
	const sideIndex = Math.floor(Math.random() * 4);
	let spawnX, spawnY;
	switch (sideIndex) {
		case 0:
			spawnX = Math.random() * width;
			spawnY = -margin;
			break;
		case 1:
			spawnX = width + margin;
			spawnY = Math.random() * height;
			break;
		case 2:
			spawnX = Math.random() * width;
			spawnY = height + margin;
			break;
		case 3:
			spawnX = -margin;
			spawnY = Math.random() * height;
			break;
	}
	return { x: spawnX, y: spawnY };
}

export function spawnEntityFromDef(scene, definition, id) {
  const { x, y } = randomEdgeSpawn(scene.cameras.main);
  const entity = new CompositeEntity(scene, x, y, definition, id);
  return entity;
}
