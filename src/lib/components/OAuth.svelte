<script lang="ts">
	import googleIcon from '$lib/assets/svg/googleIcon.svg';
	import { page } from '$app/stores';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { auth, db } from '$lib/firebase';
	import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import errorExtractor from '$lib/utils/errorExtractor';
	import { notifications } from '$lib/notifications';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { createEventDispatcher } from 'svelte';

	export let isLoading = false;

	const dispatch = createEventDispatcher();

	const onGoogleClick = async () => {
		try {
			isLoading = true;
			dispatch('loadingStateChange', { isLoading });
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			const idToken = await result.user.getIdToken();

			// Check for user
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			// If user, doesn't exist, create user
			if (!docSnap.exists()) {
				await setDoc(doc(db, 'users', user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp()
				});
			}
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
			dispatch('loadingStateChange', { isLoading });
			notifications.success(data.message);
		} catch (error) {
			isLoading = false;
			dispatch('loadingStateChange', { isLoading });
			errorExtractor(error);
		}
	};
</script>

<div class="socialLogin">
	<p>Sign {$page.route.id === '/sign-up' ? 'up' : 'in'} with</p>
	<button class="socialIconDiv" on:click={onGoogleClick}>
		<img class="socialIconImg" src={googleIcon} alt="google" />
	</button>
</div>
