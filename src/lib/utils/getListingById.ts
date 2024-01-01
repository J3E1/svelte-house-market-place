import { adminDB } from '$lib/server/admin';
import type { ResponseListing } from '../../routes/category/[categoryName]/+page.server';

export default async function getListingById(id: string) {
	try {
		const docRef = adminDB.collection('listings').doc(id);
		const docSnap = await docRef.get();
		const listing = docSnap.data() as ResponseListing;

		listing.timestamp = listing.timestamp.toString();

		return listing;
	} catch (error) {
		console.log('🚀 ~ file: getListingById.ts:8 ~ getListingById ~ error:', error);
		return null;
	}
}
