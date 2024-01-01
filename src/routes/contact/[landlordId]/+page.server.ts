import { adminDB } from '$lib/server/admin';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const docRef = adminDB.collection('users').doc(params.landlordId);
	const docSnap = await docRef.get();

	if (docSnap.exists)
		return {
			email: docSnap.data()?.email as string,
			name: docSnap.data()?.name as string
		};

	return {};
}) satisfies PageServerLoad;
