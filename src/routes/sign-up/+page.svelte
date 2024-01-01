<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { auth, db } from '$lib/firebase';
	import { notifications } from '$lib/notifications';
	import errorExtractor from '$lib/utils/errorExtractor';
	import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
	import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

	let isLoading = false;

	const submitHandler = async (
		e: Event & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		try {
			isLoading = true;
			const formData = new FormData(e.currentTarget);
			const email = formData.get('email')!.toString();
			const name = formData.get('name')!.toString();
			const password = formData.get('password')!.toString();

			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			const idToken = await userCredential.user.getIdToken();

			if (!auth.currentUser) throw new Error('CurrentUser not found!');

			updateProfile(auth.currentUser, {
				displayName: name
			});

			const userData = {
				email,
				name,
				timestamp: serverTimestamp()
			};

			await setDoc(doc(db, 'users', user.uid), userData);

			const res = await fetch('/api/auth', {
				method: 'POST',
				body: JSON.stringify({ idToken: idToken }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await res.json();

			goto('/');
			isLoading = false;
			notifications.success(data.message);
		} catch (error) {
			isLoading = false;
			errorExtractor(error);
		}
	};
</script>

<AuthForm {submitHandler} {isLoading} />
