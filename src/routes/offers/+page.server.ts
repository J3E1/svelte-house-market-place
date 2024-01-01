import { adminDB } from '$lib/server/admin';
import type { ResponseListing } from '../category/[categoryName]/+page.server';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const q = adminDB
		.collection('listings')
		.where('offer', '==', true)
		.orderBy('timestamp', 'desc')
		.limit(5);

	const querySnapshot = await q.get();

	const listings: { id: string; data: ResponseListing }[] = [];
	querySnapshot.forEach((doc) => {
		const listingData = doc.data() as ResponseListing;
		// Convert non-serializable types, like timestamp, to serializable types
		listingData.timestamp = listingData.timestamp?.toString();

		listings.push({
			id: doc.id,
			data: listingData
		});
	});

	return { listings: listings };
}) satisfies PageServerLoad;
