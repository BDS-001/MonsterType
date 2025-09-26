export function invariant(condition, message = 'Invariant violated') {
	if (!condition) {
		throw new Error(message);
	}
}
