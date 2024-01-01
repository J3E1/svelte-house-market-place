export default function generateUniqueId(length = 8) {
	const timestamp = Date.now().toString(36);
	const randomPart = Math.random().toString(36).substr(2, length);
	return timestamp + randomPart;
}
