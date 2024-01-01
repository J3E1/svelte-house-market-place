<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { auth } from '$lib/firebase';
	import { notifications } from '$lib/notifications';
	import errorExtractor from '$lib/utils/errorExtractor';
	import { signInWithEmailAndPassword } from 'firebase/auth';

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
			const password = formData.get('password')!.toString();
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const idToken = await userCredential.user.getIdToken();

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
