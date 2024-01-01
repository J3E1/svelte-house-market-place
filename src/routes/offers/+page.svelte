<script lang="ts">
	import ListingItem from '$lib/components/ListingItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Offers</title>
</svelte:head>

<div class="category">
	<header>
		<p class="pageHeader">Offers</p>
	</header>

	<main>
		<ul class="categoryListings">
			{#each data.listings as listing (listing.id)}
				<ListingItem listing={listing.data} id={listing.id} />
			{/each}
		</ul>
	</main>

	<br />
	<br />
	<!-- {listings.length > 10 && lastFetchedListing && (
						<p class='loadMore' onClick={onFetchMoreListings}>
							Load More
						</p>
					)} -->
</div>
