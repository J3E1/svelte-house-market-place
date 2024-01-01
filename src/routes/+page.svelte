<script lang="ts">
	import sellCategoryImage from '$lib/assets/jpg/sellCategoryImage.jpg';
	import rentCategoryImage from '$lib/assets/jpg/rentCategoryImage.jpg';
	import { onMount } from 'svelte';
	import SliderLoader from '$lib/components/SliderLoader.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let Slider: any;
	onMount(async () => {
		const module = await import('$lib/components/Slider.svelte');
		Slider = module.default;
	});
</script>

<svelte:head>
	<title>Explore</title>
</svelte:head>

<div class="explore">
	<header>
		<h3 class="pageHeader">Explore</h3>
	</header>

	<main>
		{#if !Slider}
			<h3 class="exploreHeading">Loading best offers...</h3>
			<SliderLoader />
		{:else}
			<h3 class="exploreHeading">Recommended</h3>
			<svelte:component this={Slider} listings={data.listings} />
		{/if}

		<h3 class="exploreCategoryHeading">Categories</h3>
		<div class="exploreCategories">
			<a href="/category/rent">
				<img src={rentCategoryImage} alt="rent" class="exploreCategoryImg" />
				<p class="exploreCategoryName">Places for rent</p>
			</a>
			<a href="/category/sale">
				<img src={sellCategoryImage} alt="sell" class="exploreCategoryImg" />
				<p class="exploreCategoryName">Places for sale</p>
			</a>
		</div>
	</main>
</div>
