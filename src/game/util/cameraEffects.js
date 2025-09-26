export function shakeCamera(scene, intensity = 0.004, duration = 45) {
	const cam = scene?.cameras?.main;
	if (!cam) {
		throw new Error('shakeCamera: scene.cameras.main is missing');
	}
	cam.shake(duration, intensity);
}
