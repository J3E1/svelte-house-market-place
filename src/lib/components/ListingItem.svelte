<script lang="ts">
	import type { Listing } from '$lib/store';
	import bedIcon from '$lib/assets/svg/badgeIcon.svg';
	import bathtubIcon from '$lib/assets/svg/bathtubIcon.svg';
	import type { ResponseListing } from '../../routes/category/[categoryName]/+page.server';
	import { fade, fly } from 'svelte/transition';
	export let listing: ResponseListing,
		id: string,
		isAdmin = false,
		onDelete: undefined | ((listingId: string) => Promise<void>) = undefined;
</script>

<li class="categoryListing" transition:fade>
	<a href={`/category/${listing.type}/${id}`} class="categoryListingLink">
		<img src={listing.imgUrls[0]} alt={listing.name} class="categoryListingImg" />

		<div class="categoryListingDetails">
			<p class="categoryListingLocation">{listing.location || 'Not Available'}</p>
			<p class="categoryListingName">{listing.name}</p>

			<p class="categoryListingPrice">
				$
				{listing.offer
					? listing.discountedPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
					: listing.regularPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
				{listing.type === 'rent' ? ' / Month' : ''}
			</p>
			<div class="categoryListingInfoDiv">
				<img src={bedIcon} alt="bed" />
				<p class="categoryListingInfoText">
					{+listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
				</p>
				<img src={bathtubIcon} alt="bath" />
				<p class="categoryListingInfoText">
					{+listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
				</p>
			</div>
		</div>
	</a>
	{#if isAdmin}
		<div class="admin-icons">
			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions a11y-no-static-element-interactions-->
			<a href={`/edit-listing/${id}`}>
				<svg height="24px" viewBox="0 0 24 24" width="24px" class="editIcon" fill="#000000">
					<!-- on:click={() => onEdit(id)} -->
					<path d="M0 0h24v24H0z" fill="none" />
					<path
						d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
					/>
				</svg></a
			>
			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions a11y-no-static-element-interactions-->
			<svg
				height="24px"
				viewBox="0 0 24 24"
				width="24px"
				class="removeIcon"
				fill="rgb(231, 76,60)"
				on:click={() => onDelete && onDelete(id)}
			>
				<path d="M0 0h24v24H0z" fill="none" />
				<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
			</svg>
		</div>
	{/if}
</li>
