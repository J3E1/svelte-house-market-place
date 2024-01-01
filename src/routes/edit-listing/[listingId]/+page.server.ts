import { adminDB } from '$lib/server/admin';
import { error, redirect } from '@sveltejs/kit';
import type { ResponseListing } from '../../category/[categoryName]/+page.server';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const docRef = adminDB.collection('listings').doc(params.listingId);
	const docSnap = await docRef.get();

	if (!docSnap.exists) redirect(300, '/');

	const listing = docSnap.data() as ResponseListing;

	listing.timestamp = listing.timestamp?.toString();

	return { listing: listing, uid: locals.userID, id: params.listingId };
}) satisfies PageServerLoad;
