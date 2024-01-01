import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import * as admin from 'firebase-admin';
import {
	FB_CLIENT_EMAIL,
	FB_PRIVATE_KEY,
	FB_PROJECT_ID,
	FB_SERVICE_ACCOUNT
} from '$env/static/private';
import pkg from 'firebase-admin';

try {
	// Check if the app is already initialized
	if (!admin.apps.length) {
		pkg.initializeApp({
			credential: pkg.credential.cert({
				projectId: FB_PROJECT_ID,
				clientEmail: FB_CLIENT_EMAIL,
				privateKey: FB_PRIVATE_KEY
			})
		});
	}
} catch (err) {
	console.log('🚀 ~ file: admin.ts:21 ~ err:', err);

	// if (!/already exists/u.test(err.message)) {
	// 	console.error('Firebase Admin Error: ', err.stack);
	// }
}

export const adminDB = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();
