import { notifications } from '$lib/notifications';

export default function errorExtractor(err: unknown) {
	if (err instanceof Error) {
		notifications.danger(err.message);
		return;
	}
	if (typeof err === 'object' && err !== null && 'data' in err) {
		const errorResponse = (err as { data: { message: string } }).data;
		if (typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse) {
			notifications.danger(errorResponse.message);
		} else {
			console.log('🚀 ~ file: errorExtractor.ts:4 ~ errorExtractor ~ err:', err);
			notifications.danger('Invalid error response format');
		}
	} else {
		console.log('🚀 ~ file: errorExtractor.ts:4 ~ errorExtractor ~ err:', err);
		notifications.danger('Unknown error occurred');
	}
}
