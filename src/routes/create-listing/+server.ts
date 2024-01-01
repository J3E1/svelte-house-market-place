import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {} from 'firebase-admin/storage';
import { adminAuth, adminDB, adminStorage } from '$lib/server/admin';
import generateUniqueId from '$lib/utils/generateId';
export const POST: RequestHandler = async ({ request, locals }) => {
	const uid = locals.userID;

	if (!uid) throw redirect(304, '/profile');

	const listing = await request.json();
	listing.userRef = uid;

	// Reference to the 'listings' collection
	const listingsRef = adminDB.collection('listings');

	// Use the 'add' method to create a new document with an auto-generated ID
	const newListingRef = await listingsRef.add(listing);

	return json({
		message: 'Listing added successfully',
		id: newListingRef.id
	});
};
