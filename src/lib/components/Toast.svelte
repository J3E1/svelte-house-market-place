<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { notifications } from '$lib/notifications';
	import type { NotificationsStore } from '$lib/notifications';

	export let themes = {
		danger: 'rgb(231, 76,60)',
		success: '#00cc66',
		warning: '#f0ad4e',
		info: '#5bc0de',
		default: '#aaaaaa'
	};
	$: notificationList = $notifications as NotificationsStore[];
</script>

<div class="notifications">
	{#each notificationList as notification (notification.id)}
		<div
			animate:flip
			class="toast"
			style="background: {themes[notification.type]};"
			transition:fly={{ x: 30 }}
		>
			<div class="content">{notification.message}</div>
			<!-- {#if notification.icon}<i class={notification.icon} />{/if} -->
		</div>
	{/each}
</div>

<style>
	.notifications {
		position: fixed;
		top: 10px;
		right: 10px;
		margin: 0 auto;
		padding: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		pointer-events: none;
	}

	.toast {
		flex: 0 0 auto;
		margin-bottom: 10px;
	}

	.content {
		padding: 12px 20px;
		display: block;
		color: white;
		font-weight: 600;
		font-family: 'Montserrat', sans-serif;
	}
</style>
