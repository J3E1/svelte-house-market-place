<script lang="ts">
	import type { PageData } from './$types';
	import shareIcon from '$lib/assets/svg/shareIcon.svg';
	import { onMount } from 'svelte';
	import SliderLoader from '$lib/components/SliderLoader.svelte';
	import { page } from '$app/stores';
	export let data: PageData;

	const listing = data.listing;
	let shareLinkCopied = false;

	const copyLinkHandler = () => {
		navigator.clipboard.writeText(window.location.href);
		shareLinkCopied = true;
		setTimeout(() => {
			shareLinkCopied = false;
		}, 3000);
	};

	let Slider: any;
	onMount(async () => {
		const module = await import('$lib/components/Slider.svelte');
		Slider = module.default;
	});
</script>

<svelte:head>
	<title>{listing.name} || {listing.location || 'NA'}</title>
</svelte:head>

<main>
	{#if !Slider}
		<SliderLoader />
	{:else}
		<svelte:component this={Slider} images={listing.imgUrls} />
	{/if}

	<div class="shareIconDiv" on:click={copyLinkHandler}>
		<img src={shareIcon} alt="Share" class="shareIcon" />
	</div>
	{#if shareLinkCopied}
		<p class="linkCopied">Link Copied</p>
	{/if}

	<div class="listingDetails">
		<p class="listingName">
			{listing.name} - $
			{listing.offer
				? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
				: listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
		</p>
		<p class="listingLocation">{listing.location || 'NA'}</p>
		<p class="listingType">
			For {listing.type === 'rent' ? 'Rent' : 'Sale'}
		</p>

		{#if listing.offer}
			<p class="discountPrice">
				${+listing.regularPrice - +listing.discountedPrice} discount
			</p>
		{/if}

		<ul class="listingDetailsList">
			<li>
				{+listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
			</li>
			<li>
				{+listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
			</li>
			<li>{listing.parking && 'Parking Spot'}</li>
			<li>{listing.furnished && 'Furnished'}</li>
		</ul>

		<!-- <p class="listingLocationTitle">Location</p> -->

		<!-- <div class='leafletContainer'>
					<MapContainer
						style={{ height: '100%', width: '100%' }}
						center={[listing.geolocation.lat, listing.geolocation.lng]}
						zoom={13}
						scrollWheelZoom={false}>
						<TileLayer
							// attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						/>
						<Marker
							position={[listing.geolocation.lat, listing.geolocation.lng]}>
							<Popup>{listing.location}</Popup>
						</Marker>
					</MapContainer>
				</div> -->

		{#if data.isAdmin}
			<a href={`/edit-listing/${data.id}`} class="primaryButton"> Edit Listing </a>
		{:else}
			<a href={`/contact/${listing.userRef}?listingName=${listing.name}`} class="primaryButton">
				Contact Landlord
			</a>
		{/if}
	</div>
</main>
