import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDB } from '$lib/server/admin';
import type { ResponseListing } from '../../category/[categoryName]/+page.server';

export const PATCH: RequestHandler = async ({ params: { listingId }, request }) => {
	const listing = await request.json();

	const listingsRef = adminDB.collection('listings').doc(listingId);
	await listingsRef.update(listing);
	return json({ message: 'Listing updated successfully' });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { listingId } = params,
		{ userID } = locals;
	const docRef = adminDB.collection('listings').doc(listingId);
	const docSnap = await docRef.get();

	if (!docSnap.exists) throw error(400, 'Listing not found');

	const listing = docSnap.data() as ResponseListing;

	if (listing.userRef !== userID) throw error(401, 'Unauthorized');

	await docRef.delete();

	return json({ message: 'Listing deleted successfully' });
};
