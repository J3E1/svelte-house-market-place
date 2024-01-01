import { fail, redirect } from '@sveltejs/kit';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import type { Actions, PageServerLoad } from './$types';
import { adminAuth } from '$lib/server/admin';

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
		const name = String(formData.get('name'));

		return { success: true };
	}
} satisfies Actions;
