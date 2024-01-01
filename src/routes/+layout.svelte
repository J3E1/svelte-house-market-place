<script lang="ts">
	import type { LayoutData } from './$types';
	import NavBar from '$lib/components/NavBar.svelte';

	import '../app.css';
	import AnimatedRoutes from '$lib/components/AnimatedRoutes.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	let isLoading = false;
	//

	// export let data: LayoutData;
</script>

<!-- {#if isLoading}
	<ProgressBar />
{/if} -->

<AnimatedRoutes>
	<div class="container mb-85">
		<slot />
	</div>
</AnimatedRoutes>

<Toast />

<NavBar />
