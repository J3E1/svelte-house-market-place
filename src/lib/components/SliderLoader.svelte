<div class="loaderContainer">
	<div class="loadingSpinner" />
</div>

<style>
	.loaderContainer {
		width: 100%;
		min-height: 225px;
		height: 23vw;
		display: grid;
		place-items: center;
	}
	.loadingSpinner {
		width: 44px;
		height: 44px;
		border: 4px solid;
		border-color: #00cc66 transparent #00cc66 transparent;
		border-radius: 50%;
		animation: spin 1.2s linear infinite;
	}
</style>
