<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
	let message = '';
	const listingName = $page.url.searchParams.get('listingName');
</script>

<svelte:head>
	<title>{listingName}</title>
</svelte:head>

<div class="pageContainer">
	<header>
		<p class="pageHeader">Contact Landlord</p>
	</header>

	<main>
		<div class="contactLandlord">
			<p class="landlordName">Contact {data.name}</p>
		</div>

		<form class="messageForm">
			<div class="messageDiv">
				<label for="message" class="messageLabel"> Message </label>
				<textarea name="message" id="message" class="textarea" bind:value={message} required />
			</div>

			<a href={`mailto:${data.email}?Subject=${listingName}&body=${message}`}>
				<button type="button" class="primaryButton"> Send Message </button>
			</a>
		</form>
	</main>
</div>
