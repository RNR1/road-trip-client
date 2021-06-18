<script lang="ts">
	import Backdrop from '../Backdrop/Backdrop.svelte';
	import auth from '$data/auth';
	import { onDestroy, onMount } from 'svelte';
	import type { AuthResponse } from '$typings/auth';
	import type { Unsubscriber } from 'svelte/store';
	import NavItem from './NavItem.svelte';
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
			<NavItem href="/trips" icon="map" label="My trips" />
			<NavItem href="/trips/invitations" icon="loyalty" label="Trip invitations" />
			<NavItem href="/book-a-room" icon="hotel" label="Book a room" />
			<NavItem href="/logout" icon="logout" label="Logout" />
		{:else}
			<NavItem href="/login" icon="login" label="Login" />
			<NavItem href="/signup" icon="login" label="Sign up" />
		{/if}
	</nav>
</div>

<style>
	#modal {
		position: absolute;
		background-color: white;
		border-radius: 8px;
		right: 10px;
		top: 65px;
		z-index: 100;
		min-width: max-content;
		box-shadow: 0px 10px 17.869px rgba(0, 0, 0, 0.0417275), 0px -3px 10.0172px rgba(0, 0, 0, 0.035),
			0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725),
			0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802);
	}

	nav {
		display: block;
		width: 100%;
		border-radius: inherit;
	}
</style>
