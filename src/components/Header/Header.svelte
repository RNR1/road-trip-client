<script lang="ts">
	import auth from '$data/auth';
	import Avatar from '$components/Avatar';
	import Navbar from '$components/Navbar';
	import { onDestroy, onMount } from 'svelte';
	import type { AuthResponse } from '$typings/auth';
	import type { Unsubscriber } from 'svelte/store';

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

	const onClick = () => {
		open = !open;
	};
</script>

<header>
	<h1><a href="/">Road Trip</a></h1>
	<div>
		<strong>{session?.firstName ?? 'User'}</strong>
		<Avatar name={fullName} src={session?.avatar} on:click={onClick} />
		{#if open}
			<Navbar on:click={onClick} />
		{/if}
	</div>
</header>

<style>
	h1 a {
		color: inherit;
	}
	h1 a:hover {
		text-decoration: none;
	}
	header {
		display: flex;
		align-content: center;
		justify-content: space-between;
		position: fixed;
		left: 0;
		top: 0;
		padding: 0 2rem;
		width: 100%;
		text-align: center;
		background-color: #ce97b0;
	}

	div {
		position: relative;
		margin: auto 0;
		display: flex;
		align-items: center;
		border: 1px solid #ccc;
		border-radius: 20px;
		padding: 0.5rem 1rem;
	}

	div strong {
		margin-right: 8px;
	}
</style>
