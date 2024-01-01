<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ListingItem from '$lib/components/ListingItem.svelte';

	$: params = $page.params;
	export let data: PageData;
</script>

<svelte:head>
	<title>{params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}</title>
</svelte:head>

<div class="category">
	<header>
		<p class="pageHeader">
			{params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
		</p>
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
