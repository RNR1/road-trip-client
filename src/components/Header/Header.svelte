<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import auth from '$data/auth';
	import Avatar from '$components/Avatar';
	import Navbar from '$components/Navbar';
	import { APP_NAME } from '$config/constants';
	import type { AuthResponse } from '$typings/auth';

	let open = false;
	let session: AuthResponse | null = null;
	let unsubscribe: Unsubscriber;

	$: fullName = session?.firstName
		? `${session?.firstName ?? ''} ${session?.lastName ?? ''}`?.trim()
		: 'User';

	onMount(() => {
		unsubscribe = auth.subscribe((authSession) => {
			session = authSession as AuthResponse;
		});
	});

	onDestroy(() => unsubscribe?.());

	const toggleNav = () => {
		open = !open;
	};
</script>

<header>
	<a href="/"><img id="brand-logo" src="/logo_full.png" alt={APP_NAME} /></a>
	<div>
		<strong>{session?.firstName ?? 'User'}</strong>
		<Avatar name={fullName} src={session?.avatar} on:click={toggleNav} />
		{#if open}
			<Navbar on:click={toggleNav} />
		{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		align-content: center;
		justify-content: space-between;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		text-align: center;
		background-color: rgba(255, 219, 235, 1);
		z-index: 1000;
		height: 85px;
	}

	div {
		position: relative;
		margin: auto 0;
		display: flex;
		align-items: center;
		border-radius: 20px;
		padding: 0.5rem 1rem;
	}

	div strong {
		margin-right: 8px;
	}

	a {
		height: 100%;
	}

	#brand-logo {
		height: 100%;
	}

	@media (max-width: 500px) {
		strong {
			font-size: 0;
		}
	}
</style>
