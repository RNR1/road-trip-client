<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { Trips } from '$api/methods';
	import { browser } from '$app/env';
	import type { Trip } from '$typings/trips';
	import { APP_NAME, PLACEHOLDER_IMAGE } from '$config/constants';

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
	import ParticipantsList from '$components/ParticipantsList';

	export let trip: Trip | null = null;
	let image = trip.image ?? PLACEHOLDER_IMAGE;
</script>

<svelte:head>
	<title>{APP_NAME} • {trip?.name}</title>
</svelte:head>
<h2>{trip?.name ?? 'Trip Name'}</h2>
<p>"{trip.description}"</p>
<section>
	<h3>Participants:</h3>
	<ParticipantsList inviteLink={`/trips/${trip.slug}/invite`} participants={trip?.participants} />
</section>
<img src={image.src} alt={image.alt} />

<style>
	h2 {
		font-size: 2rem;
		width: 100%;
		margin: 20px 60px;
	}
	section {
		justify-self: flex-start;
		width: 100%;
	}
	img {
		border-radius: 6px;
	}
</style>
