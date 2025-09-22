export function applyTextShadow(
	text,
	dx = 0,
	dy = 3,
	color = '#000000',
	blur = 6,
	stroke = true,
	fill = true
) {
	text.setShadow(dx, dy, color, blur, stroke, fill);
	return text;
}
