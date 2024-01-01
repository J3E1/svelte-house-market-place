import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminAuth, adminDB } from '$lib/server/admin';
import type { ResponseListing } from '../category/[categoryName]/+page.server';

export const load = (async ({ locals, depends }) => {
	const user = locals.userID;

	if (!user) throw redirect(302, '/sign-in');

	depends('user:profile');

	const userRecord = await adminAuth.getUser(user);

	const q = adminDB
		.collection('listings')
		.where('userRef', '==', user)
		.orderBy('timestamp', 'desc');

	const querySnapshot = await q.get();

	const listings: { id: string; data: ResponseListing }[] = [];

	querySnapshot.forEach((doc) => {
		const listingData = doc.data() as ResponseListing;
		// Convert non-serializable types, like timestamp, to serializable types
		listingData.timestamp = listingData.timestamp.toString();

		listings.push({
			id: doc.id,
			data: listingData
		});
	});

	return {
		name: userRecord.displayName,
		email: userRecord.email,
		listings: listings
	};
}) satisfies PageServerLoad;
