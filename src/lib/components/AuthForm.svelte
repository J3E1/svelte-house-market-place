<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import visibilityIcon from '$lib/assets/svg/visibilityIcon.svg';
	import KeyboardArrowRightIcon from '$lib/assets/svg/KeyboardArrowRightIcon.svelte';
	import OAuth from './OAuth.svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';

	let showPassword = false;
	$: isRegisterPage = $page.route.id === '/sign-up';

	export let isLoading = false;
	export let submitHandler: (
		e: Event & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => void;

	function handleChildEvent(e: CustomEvent<{ isLoading: boolean }>) {
		isLoading = e.detail.isLoading;
	}
</script>

<svelte:head>
	<title>Welcome{!isRegisterPage ? ' Back' : ''}!</title>
</svelte:head>

{#if isLoading}
	<LoadingSpinner />
{/if}

<div class="pageContainer">
	<header>
		<p class="pageHeader">Welcome{!isRegisterPage ? ' Back' : ''}!</p>
	</header>

	<form on:submit|preventDefault={submitHandler}>
		{#if isRegisterPage}
			<input type="text" class="nameInput" placeholder="Name" name="name" required />
		{/if}

		<input type="email" class="emailInput" placeholder="Email" name="email" required />

		<div class="passwordInputDiv">
			<input
				type={showPassword ? 'text' : 'password'}
				class="passwordInput"
				placeholder="Password"
				name="password"
				required
			/>
			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions-->
			<img
				src={visibilityIcon}
				alt="show password"
				class="showPassword"
				on:click={() => (showPassword = !showPassword)}
			/>
		</div>

		{#if !isRegisterPage}
			<div class="forgotPasswordLink"><a href="/forgot-password">Forgot Password</a></div>
		{/if}

		<div class="signUpBar">
			<p class="signUpText">Sign {isRegisterPage ? 'Up' : 'In'}</p>
			<button class="signUpButton" type="submit">
				<KeyboardArrowRightIcon fill="#ffffff" width="34px" height="34px" />
			</button>
		</div>
	</form>

	<OAuth {isLoading} on:loadingStateChange={handleChildEvent} />

	<div class="registerLink">
		<a href={isRegisterPage ? '/sign-in' : '/sign-up'}
			>Sign {isRegisterPage ? 'In' : 'Up'} Instead</a
		>
	</div>
</div>
