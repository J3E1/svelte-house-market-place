import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const uid = locals.userID;

	if (!uid) throw redirect(302, '/sign-in');
	return { uid };
}) satisfies PageServerLoad;
