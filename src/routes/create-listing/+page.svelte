<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { notifications } from '$lib/notifications';
	import { listings, type Listing } from '$lib/store';
	import errorExtractor from '$lib/utils/errorExtractor';
	import storeImage from '$lib/utils/storeImage';
	import { json } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { serverTimestamp } from 'firebase/firestore';

	export let data: PageData;

	let type: 'sale' | 'rent' = 'sale',
		parking: boolean,
		furnished: boolean,
		offer: boolean,
		isLoading = false;

	const submitHandler = async (
		e: Event & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		try {
			isLoading = true;
			const formData = new FormData(e.currentTarget);

			const imagesFormData = formData.getAll('images');

			let images: File[] = [];

			imagesFormData.forEach((imageData) => {
				if (imageData instanceof File) {
					// If 'imagesFormData' is a FileList, convert it to an array of File objects
					images = [...images, imageData];
				}
			});

			if (images.length > 6) {
				isLoading = false;
				notifications.danger('Please select maximum 6 images only');
				return;
			}

			const imgUrls = await Promise.all(
				[...images].map((image) => storeImage(image, data.uid))
			).catch(() => {
				isLoading = false;
				notifications.danger('Images not uploaded');
				return;
			});

			const listing: Record<string, any> = {
				name: formData.get('name'),
				bedrooms: formData.get('bedrooms'),
				bathrooms: formData.get('bathrooms'),
				location: formData.get('address'),
				regularPrice: formData.get('regularPrice'),
				type,
				parking,
				furnished,
				offer,
				imgUrls,
				timestamp: serverTimestamp()
			};

			if (listing.offer) listing.discountedPrice = formData.get('discountedPrice');

			const res = await fetch('/create-listing', {
				method: 'POST',
				body: JSON.stringify(listing)
			});
			const resData = await res.json();

			notifications.success(resData.message);
			goto(`/category/${listing.type}/${resData.id}`);
			isLoading = false;
		} catch (error) {
			isLoading = false;
			errorExtractor(error);
		}
	};
</script>

<svelte:head>
	<title>Create a listing</title>
</svelte:head>

{#if isLoading}
	<LoadingSpinner />
{/if}

<div class="profile">
	<header>
		<p class="pageHeader">Create a Listing</p>
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
							/>
						</div>
					</div>
					<label class="formLabel">Address</label>
					<textarea required class="formInputAddress" name="address" />
				</div>

				<div>
					<!-- {!geolocationEnabled && (
            <div class='formLatLng flex'>
              <div>
                <label class='formLabel'>Latitude</label>
                <input
                  class='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  
                />
              </div>
              <div>
                <label class='formLabel'>Longitude</label>
                <input
                  class='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  
                />
              </div>
            </div>
          )} -->

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
							/>
							{#if type === 'rent'} <p class="formPriceText">$ / Month</p>{/if}
						</div>
					{/if}
				</div>
			</div>

			<label class="formLabel">Images</label>
			<p class="imagesInfo">The first image will be the cover (max 6).</p>
			<input
				required
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

<style>
	.create-listing__container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	@media (width<= 640px) {
		.create-listing__container {
			grid-template-columns: repeat(1, 1fr);
		}
	}
	/* @media (min-width: 768px) {
		.container {
			max-width: 768px;
		}
	}
	@media (min-width: 1024px) {
		.container {
			max-width: 1024px;
		}
	}
	@media (min-width: 1536px) {
		.container {
			max-width: 1536px;
		}
	} */
</style>
