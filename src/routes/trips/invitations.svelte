<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { Trips } from '$api/methods';

	export const load: Load = async ({ fetch }) => {
		try {
			const invitations = await Trips.invitations({ fetch });
			return { status: 200, props: { invitations } };
		} catch (err) {
			return { status: err.status, props: { error: err.message, severity: 'error' } };
		}
	};
</script>

<script lang="ts">
	import Card from '$components/Card';
	import { APP_NAME } from '$config/constants';
	import type { Trip } from '$typings/trips';
	import TripsList from '$components/TripsList';
	import TripInviteItem from '$components/TripsList/TripInviteItem.svelte';

	export let invitations: Trip[] = [];
</script>

<svelte:head>
	<title>{APP_NAME} • My trip invitations</title>
</svelte:head>
<section>
	<h2>My trip invitations</h2>
	<TripsList trips={invitations}>
		<TripInviteItem slot="item" let:trip {trip} />
		<li slot="placeholder">There's nothing here yet!</li>
	</TripsList>
</section>

<style>
	h2 {
		font-size: 1.5rem;
	}

	li {
		margin: 0;
		padding: 0;
	}
</style>
