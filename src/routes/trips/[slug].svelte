<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { Trips } from '$api/methods';
	import { browser } from '$app/env';
	import type { Trip } from '$typings/trips';

	export const load: Load = async ({ page, fetch }) => {
		try {
			const trip: Trip = browser ? await Trips.trip({ fetch }, page.params.slug) : undefined;
			return { status: 200, props: { trip } };
		} catch (err) {
			return { status: 302, redirect: '/404' };
		}
	};
</script>

<script lang="ts">
	export let trip: Trip | null = null;

	$: participants = (trip?.participants ?? [])
		.map((participant) => `${participant.firstName} ${participant.lastName}`)
		.join(', ');
</script>

<h2>{trip?.name ?? 'Trip Name'}</h2>
<p>by {participants}</p>
<p>"{trip.description}"</p>
