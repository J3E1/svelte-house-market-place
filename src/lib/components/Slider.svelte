<script lang="ts">
	// Import Swiper Svelte components
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import exterior_1 from '$lib/assets/jpg/exterior_1.jpeg';
	import exterior_2 from '$lib/assets/jpg/exterior_2.jpeg';
	import exterior_3 from '$lib/assets/jpg/exterior_3.jpeg';
	import exterior_4 from '$lib/assets/jpg/exterior_4.jpeg';

	// Import Swiper styles
	import 'swiper/css';
	import { fade } from 'svelte/transition';
	import { list } from 'firebase/storage';
	import { goto } from '$app/navigation';

	export let listings:
		| {
				name: string;
				regularPrice: string;
				type: string;
				id: string;
				cover: string;
				discountedPrice?: string;
		  }[]
		| undefined = undefined;
	export let images: string[] | undefined = undefined;
</script>

<div in:fade>
	<Swiper
		slidesPerView={1}
		pagination={{ clickable: true }}
		autoHeight
		autoplay={{ delay: 500 }}
		loop
	>
		{#if images}
			{#each images as image, i}
				<SwiperSlide>
					<div
						style={`background: url(${image}) center no-repeat;background-size:cover;min-height: 225px;height: 23vw`}
						class="swiperSlideDiv"
					/>
				</SwiperSlide>
			{/each}
		{:else if listings}
			{#each listings as listing (listing.id)}
				<SwiperSlide>
					<div
						style={`background: url(${listing.cover}) center no-repeat;background-size:cover;min-height: 225px;height: 23vw`}
						class="swiperSlideDiv"
						on:click={() => goto(`/category/${listing.type}/${listing.id}`)}
					>
						<p class="swiperSlideText">{listing.name}</p>
						<p class="swiperSlidePrice">
							${listing.discountedPrice ?? listing.regularPrice}{' '}
							{listing.type === 'rent' && '/ month'}
						</p>
					</div>
				</SwiperSlide>
			{/each}
		{/if}
	</Swiper>
</div>
