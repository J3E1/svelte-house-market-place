<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { notifications } from '$lib/notifications';
	import errorExtractor from '$lib/utils/errorExtractor';
	import getChangedProperties from '$lib/utils/getChangedProperties';
	import storeImage from '$lib/utils/storeImage';
	import { serverTimestamp } from 'firebase/firestore';
	import type { PageData } from './$types';

	export let data: PageData;
	let isLoading = false;
	let {
		bathrooms,
		bedrooms,
		furnished,
		location,
		name,
		offer,
		parking,
		regularPrice,
		type,
		discountedPrice = ''
	} = data.listing as any;
	const currentListing = data.listing;
	$: updatedListing = {
		bathrooms,
		bedrooms,
		furnished,
		location,
		name,
		offer,
		parking,
		regularPrice,
		type,
		discountedPrice
	};

	const submitHandler = async (
		e: Event & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		try {
			isLoading = true;
			const formData = new FormData(e.currentTarget);
			const listing = getChangedProperties(currentListing, updatedListing);

			if (Object.keys(listing).length === 0) {
				isLoading = false;
				return;
			}

			const imagesFormData = formData.getAll('images');

			let images: File[] = [];

			imagesFormData.forEach((imageData) => {
				if (imageData instanceof File) {
					// If 'imagesFormData' is a FileList, convert it to an array of File objects
					images = [...images, imageData];
				}
			});

			if (images.length !== 0 && images[0].size !== 0) {
				if (images.length > 6) {
					isLoading = false;
					notifications.danger('Please select maximum 6 images only');
					return;
				}

				const imgUrls = await Promise.all(
					[...images].map((image) => storeImage(image, data.uid!))
				).catch(() => {
					isLoading = false;
					notifications.danger('Images not uploaded');
					return;
				});

				listing.imgUrls = imgUrls;
			}
			listing.timestamp = serverTimestamp();

			const res = await fetch('/edit-listing/' + data.id, {
				method: 'PATCH',
				body: JSON.stringify(listing)
			});
			const resData = await res.json();

			notifications.success(resData.message);
			isLoading = false;
			goto(`/category/${data.listing.type}/${data.id}`);
		} catch (error) {
			isLoading = false;
			errorExtractor(error);
		}
	};
</script>

<svelte:head>
	<title>Update listing</title>
</svelte:head>

{#if isLoading}
	<LoadingSpinner />
{/if}

<div class="profile">
	<header>
		<p class="pageHeader">Update Listing</p>
	</header>

	<main>
		<form on:submit|preventDefault={submitHandler}>
			<div class="create-listing__container">
				<div>
					<label class="formLabel">Sell / Rent</label>
					<div class="formButtons">
						<button
							type="button"
							class={type === 'sale' ? 'formButtonActive' : 'formButton'}
							id="type"
							value="sale"
							on:click={() => {
								type = 'sale';
							}}
						>
							Sell
						</button>
						<button
							type="button"
							class={type === 'rent' ? 'formButtonActive' : 'formButton'}
							id="type"
							value="rent"
							on:click={() => {
								type = 'rent';
							}}
						>
							Rent
						</button>
					</div>

					<label class="formLabel">Name</label>
					<input
						required
						class="formInputName"
						type="text"
						name="name"
						maxLength="32"
						minLength="10"
						bind:value={name}
					/>

					<div class="formRooms flex">
						<div>
							<label class="formLabel">Bedrooms</label>
							<input
								required
								class="formInputSmall"
								type="number"
								name="bedrooms"
								min="1"
								max="50"
								bind:value={bedrooms}
							/>
						</div>
						<div>
							<label class="formLabel">Bathrooms</label>
							<input
								required
								class="formInputSmall"
								type="number"
								name="bathrooms"
								min="1"
								max="50"
								bind:value={bathrooms}
							/>
						</div>
					</div>
					<label class="formLabel">Address</label>
					<textarea required class="formInputAddress" name="address" bind:value={location} />
				</div>

				<div>
					<label class="formLabel">Parking spot</label>
					<div class="formButtons">
						<button
							class={parking ? 'formButtonActive' : 'formButton'}
							type="button"
							on:click={() => (parking = true)}
						>
							Yes
						</button>
						<button
							class={!parking ? 'formButtonActive' : 'formButton'}
							type="button"
							on:click={() => (parking = false)}
						>
							No
						</button>
					</div>

					<label class="formLabel">Furnished</label>
					<div class="formButtons">
						<button
							class={furnished ? 'formButtonActive' : 'formButton'}
							type="button"
							id="furnished"
							on:click={() => (furnished = true)}
						>
							Yes
						</button>
						<button
							class={!furnished ? 'formButtonActive' : 'formButton'}
							type="button"
							id="furnished"
							on:click={() => (furnished = false)}
						>
							No
						</button>
					</div>

					<label class="formLabel">Offer</label>
					<div class="formButtons">
						<button
							class={offer ? 'formButtonActive' : 'formButton'}
							type="button"
							id="offer"
							on:click={() => (offer = true)}
						>
							Yes
						</button>
						<button
							class={!offer ? 'formButtonActive' : 'formButton'}
							type="button"
							id="offer"
							on:click={() => (offer = false)}
						>
							No
						</button>
					</div>

					<label class="formLabel">Regular Price</label>
					<div class="formPriceDiv">
						<input
							required
							class="formInputSmall"
							type="number"
							name="regularPrice"
							min="50"
							max="750000000"
							bind:value={regularPrice}
						/>
						{#if type === 'rent'} <p class="formPriceText">$ / Month</p>{/if}
					</div>

					{#if offer}
						<label class="formLabel">Discounted Price</label>
						<div class="formPriceDiv">
							<input
								class="formInputSmall"
								type="number"
								name="discountedPrice"
								min="50"
								max="750000000"
								required={offer}
								bind:value={discountedPrice}
							/>
							{#if type === 'rent'} <p class="formPriceText">$ / Month</p>{/if}
						</div>
					{/if}
				</div>
			</div>

			<label class="formLabel">Images</label>
			<p class="imagesInfo">The first image will be the cover (max 6).</p>
			<input
				class="formInputFile"
				type="file"
				name="images"
				max="6"
				accept=".jpg,.png,.jpeg"
				multiple
			/>
			<button type="submit" class="primaryButton createListingButton"> Create Listing </button>
		</form>
	</main>
</div>
