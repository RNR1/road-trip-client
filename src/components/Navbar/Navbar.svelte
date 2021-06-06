<script lang="ts">
	import Backdrop from '../Backdrop/Backdrop.svelte';
	import auth from '$data/auth';
	import { onDestroy, onMount } from 'svelte';
	import type { AuthResponse } from '$typings/auth';
	import type { Unsubscriber } from 'svelte/store';
	let session: AuthResponse;
	let unsubscribe: Unsubscriber;

	onMount(() => {
		unsubscribe = auth.subscribe((authSession) => {
			session = authSession as AuthResponse;
		});
	});

	onDestroy(() => unsubscribe());

	$: isAuthenticated = Boolean(session?.token);
</script>

<Backdrop on:click transparent />
<div id="modal">
	<nav on:click>
		{#if isAuthenticated}
			<a href="/book-a-room">
				<span class="material-icons">hotel</span>
				<span class="label">Book a room</span>
			</a>
			<a href="/logout">
				<span class="material-icons">logout</span>
				<span class="label">Logout</span>
			</a>
		{:else}
			<a href="/login">
				<span class="material-icons">login</span>
				<span class="label">Login</span>
			</a>
			<a href="/signup">
				<span class="material-icons">login</span>
				<span class="label">Sign up</span>
			</a>
		{/if}
	</nav>
</div>

<style>
	#modal {
		position: absolute;
		background-color: white;
		border-radius: 8px;
		right: 10px;
		top: 55px;
		z-index: 100;
		min-width: max-content;
	}

	nav {
		display: block;
		width: 100%;
		border-radius: inherit;
	}
	a {
		color: inherit;
		display: flex;
		padding: 1rem 0.5rem;
		align-items: center;
		justify-content: space-around;
		height: 100%;
		width: 100%;
		border-radius: inherit;
	}

	a:hover,
	a:active {
		text-decoration: none;
		background: #ccc;
	}

	.label {
		width: 100%;
		padding: 0 2rem;
	}

	.material-icons {
		margin-right: 10px;
	}
</style>
