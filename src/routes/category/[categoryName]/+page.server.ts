import { adminDB } from '$lib/server/admin';
import type { Timestamp } from 'firebase-admin/firestore';
import type { PageServerLoad } from './$types';

export type ResponseListing = {
	name: string;
	bedrooms: string;
	bathrooms: string;
	location: string;
	regularPrice: string;
	type: 'rent' | 'sale';
	parking: boolean;
	furnished: boolean;
	imgUrls: string[];
	geolocation: [];
	timestamp: [Timestamp] | string;
	userRef: string;
} & ({ offer: true; discountedPrice: string } | { offer: false });

export const load = (async ({ params }) => {
	const q = adminDB
		.collection('listings')
		.where('type', '==', params.categoryName)
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
