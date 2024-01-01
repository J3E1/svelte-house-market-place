<script lang="ts">
	import type { PageData } from './$types';
	import homeIcon from '$lib/assets/svg/homeIcon.svg';
	import KeyboardArrowRightIcon from '$lib/assets/svg/KeyboardArrowRightIcon.svelte';
	import ListingItem from '$lib/components/ListingItem.svelte';
	import { notifications } from '$lib/notifications';
	import { goto, invalidate } from '$app/navigation';
	import { auth, db } from '$lib/firebase';
	import { updateProfile } from 'firebase/auth';
	import { doc, updateDoc } from 'firebase/firestore';
	import errorExtractor from '$lib/utils/errorExtractor';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { userStore } from '$lib/userStore';

	export let data: PageData;

	let changeDetails = false,
		name = data.name || '',
		email = data.email || '',
		listings = data.listings,
		isLoading = false;

	const updateProfileHandler = async () => {
		try {
			if (auth.currentUser?.displayName !== name) {
				isLoading = true;
				// Update display name in fb
				await updateProfile(auth.currentUser!, {
					displayName: name
				});

				// Update in firestore
				const userRef = doc(db, 'users', auth.currentUser?.uid!);
				await updateDoc(userRef, {
					name
				});
			}
			isLoading = false;
		} catch (error) {
			isLoading = false;
			errorExtractor(error);
		}
	};

	const logOutHandler = async () => {
		isLoading = true;
		await auth.signOut();
		const res = await fetch('api/auth', {
			method: 'DELETE'
		});
		const data = await res.json();
		await goto('/');
		isLoading = false;
		notifications.success(data.message);
	};

	const onDelete = async (listingId: string) => {
		if (window.confirm('Are you sure you want to delete?')) {
			isLoading = true;
			try {
				const res = await fetch('/edit-listing/' + listingId, {
					method: 'DELETE'
				});
				const data = await res.json();

				// listings = listings.filter((l) => l.id !== listingId);
				await invalidate('user:profile');

				notifications.success(data.message);
				isLoading = false;
			} catch (error) {
				isLoading = false;
				errorExtractor(error);
			}
		}
	};
</script>

<svelte:head>
	<title>Profile || {name}</title>
</svelte:head>

{#if isLoading}
	<LoadingSpinner />
{/if}

<div class="profile">
	<header class="profileHeader">
		<p class="pageHeader">My Profile</p>
		<button type="button" class="logOut" on:click={logOutHandler}>
			<!-- onClick={onLogout} -->
			LOGOUT
		</button>
	</header>
	<main>
		<div class="profileDetailsHeader">
			<p class="profileDetailsText">Personal Details</p>
			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions-->
			<p
				class="changePersonalDetails"
				on:click={() => {
					changeDetails && updateProfileHandler();
					changeDetails = !changeDetails;
				}}
			>
				{changeDetails ? 'Done' : 'Change'}
			</p>
		</div>

		<form class="profileCard">
			<input
				type="text"
				name="name"
				class={!changeDetails ? 'profileName' : 'profileNameActive'}
				disabled={!changeDetails}
				bind:value={name}
			/>
			<input
				type="email"
				name="email"
				class={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
				disabled={!changeDetails}
				bind:value={email}
			/>
		</form>

		<a href="/create-listing" class="createListing">
			<img src={homeIcon} alt="home" />
			<p>Sell or rent your home</p>
			<KeyboardArrowRightIcon />
		</a>

		{#if listings.length}
			<p class="listingText">Your Listings</p>
			<ul class="listingsList">
				{#each listings as listing (listing.id)}
					<ListingItem listing={listing.data} id={listing.id} isAdmin {onDelete} />
				{/each}
			</ul>
		{:else}
			<p class="listingText">You have not created any listings.</p>
		{/if}
	</main>
</div>
