import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const uid = locals.userID;

	if (uid) throw redirect(304, '/profile');

	return {};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = String(formData.get('email'));
		const password = String(formData.get('password'));

		if (!email || !password) {
			return fail(400, { missing: true });
		}

		return { success: true };
	}
} satisfies Actions;
