<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { Trips } from '$api/methods';
	import { browser } from '$app/env';
	import { APP_NAME, PLACEHOLDER_IMAGE } from '$config/constants';
	import type { Trip } from '$typings/trips';

	export const load: Load = async ({ page, fetch }) => {
		try {
			const trip: Trip = browser ? await Trips.trip({ fetch }, page.params.slug) : undefined;
			if (!trip && browser) throw { message: 'Trip not found' };
			return { status: 200, props: { trip } };
		} catch (err) {
			return { status: 302, redirect: '/404' };
		}
	};
</script>

<script lang="ts">
	import FloatingIconLink from '$components/FloatingIconLink';
	import NotesSection from '$components/NotesSection';
	import ParticipantsList from '$components/ParticipantsList';

	export let trip: Trip | null = null;
	let image = trip.image ?? PLACEHOLDER_IMAGE;
</script>

<svelte:head>
	<title>{APP_NAME} • {trip?.name}</title>
</svelte:head>
<div class="title">
	<h2>{trip?.name ?? 'Trip Name'}</h2>
	<div class="action-links">
		<FloatingIconLink
			title="Open trip planner"
			href={`/trips/${trip.slug}/planner?planId=${trip.plan}`}
			icon="map"
		/>
		<FloatingIconLink
			title="Open trip schedule"
			href={`/trips/${trip.slug}/schedule?scheduleId=${trip.schedule}`}
			icon="calendar_today"
		/>
		<FloatingIconLink
			title="Edit your trip information"
			href={`/trips/${trip.slug}/edit`}
			icon="edit"
		/>
	</div>
</div>
<img src={image.src} alt={image.alt} />
<p>"{trip.description}"</p>
<section>
	<h3>Participants:</h3>
	<ParticipantsList inviteLink={`/trips/${trip.slug}/invite`} participants={trip?.participants} />
</section>

<NotesSection {trip} />

<style>
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title .action-links {
		display: flex;
	}

	h2 {
		font-size: 2rem;
		width: 100%;
		margin: 20px 60px;
	}
	@media (max-width: 500px) {
		.title {
			flex-direction: column;
		}

		h2 {
			font-size: 1.5rem;
			text-align: center;
		}

		.title .action-links {
			justify-content: space-evenly;
			margin-bottom: 1rem;
		}
	}

	h3 {
		font-size: 1.5rem;
		width: 100%;
		margin: 20px 0;
	}
	section {
		justify-self: flex-start;
		width: 100%;
	}
	img {
		border-radius: 6px;
	}
</style>
