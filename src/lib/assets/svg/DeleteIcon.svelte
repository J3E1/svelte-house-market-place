<script lang="ts">
	export let fill: string = '#000000',
		className: string,
		onClick: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions a11y-no-static-element-interactions-->
<svg height="24px" viewBox="0 0 24 24" width="24px" {fill} class={className} on:click={onClick}>
	<path d="M0 0h24v24H0z" fill="none" />
	<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
</svg>
