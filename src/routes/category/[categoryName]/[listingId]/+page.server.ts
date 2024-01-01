import { adminDB } from '$lib/server/admin';
import { redirect } from '@sveltejs/kit';
import type { ResponseListing } from '../+page.server';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const uid = locals.userID;
	const docRef = adminDB.collection('listings').doc(params.listingId);
	const docSnap = await docRef.get();
	const listing = docSnap.data() as ResponseListing;

	let isAdmin = false;

	listing.timestamp = listing.timestamp?.toString();

	if (uid && uid === listing.userRef) isAdmin = true;

	return { listing: listing, isAdmin, id: params.listingId };
}) satisfies PageServerLoad;
