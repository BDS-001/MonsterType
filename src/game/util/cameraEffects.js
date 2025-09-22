export function shakeCamera(scene, intensity = 0.004, duration = 45) {
	const cam = scene?.cameras?.main;
	if (!cam) return;
	cam.shake(duration, intensity);
}
