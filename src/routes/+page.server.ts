import { adminDB } from '$lib/server/admin';
import type { PageServerLoad } from './$types';
import type { ResponseListing } from './category/[categoryName]/+page.server';

export const load = (async () => {
	const q = adminDB
		.collection('listings')
		.where('offer', '==', true)
		.orderBy('timestamp', 'desc')
		.limit(5);

	const querySnapshot = await q.get();

	const listings: Array<{
		name: string;
		regularPrice: string;
		type: string;
		id: string;
		cover: string;
		discountedPrice?: string;
	}> = [];
	querySnapshot.forEach((doc) => {
		const listingData = doc.data() as ResponseListing;

		if (listingData.offer) {
			const listing = {
				id: doc.id,
				type: listingData.type,
				cover: listingData.imgUrls[0],
				name: listingData.name,
				regularPrice: listingData.regularPrice,
				discountedPrice: listingData.discountedPrice
			};

			listings.push(listing);
		}
	});

	return { listings: listings };
}) satisfies PageServerLoad;
