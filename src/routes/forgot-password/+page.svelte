<script lang="ts">
	import KeyboardArrowRightIcon from '$lib/assets/svg/KeyboardArrowRightIcon.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="pageContainer">
	<header>
		<p class="pageHeader">Forgot Password</p>
	</header>

	<main>
		<form>
			<input type="email" class="emailInput" placeholder="Email" id="email" />
			<div class="forgotPasswordLink"><a href="/sign-in">Sign In</a></div>

			<div class="signInBar">
				<div class="signInText">Send Reset Link</div>
				<button class="signInButton">
					<KeyboardArrowRightIcon fill="#ffffff" width="34px" height="34px" />
				</button>
			</div>
		</form>
	</main>
</div>
