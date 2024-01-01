export default function getChangedProperties(objA: Record<string, any>, objB: Record<string, any>) {
	const changedProperties: Record<string, any> = {};
	if (objA === objB) return changedProperties;

	for (const key in objB) {
		if (objA[key] !== objB[key]) {
			changedProperties[key] = objB[key];
		}
	}

	return changedProperties;
}
