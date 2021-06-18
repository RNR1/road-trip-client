<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { Trips } from '$api/methods';

	export const load: Load = async ({ fetch }) => {
		try {
			const trips = await Trips.list({ fetch });
			return { status: 200, props: { trips } };
		} catch (err) {
			return { status: err.status, props: { error: err.message, severity: 'error' } };
		}
	};
</script>

<script lang="ts">
	import Button from '$components/Button';
	import Notification from '$components/Notification';
	import type { Trip } from '$typings/trips';
	import type { Status } from '$typings/common';
	import Card from '$components/Card';
	import { APP_NAME, PLACEHOLDER_IMAGE } from '$config/constants';
	import TripsList from '$components/TripsList';
	import TripItem from '$components/TripsList/TripItem.svelte';

	export let trips: Trip[] = [];
	export let error: string = '';
	export let severity: Status | null = null;
</script>

<svelte:head>
	<title>{APP_NAME} • My trips</title>
</svelte:head>
<section>
	<div class="title">
		<h2>My Trips</h2>
		<Button href="/trips/new" variant="rounded">+</Button>
	</div>
	<TripsList {trips}>
		<TripItem slot="item" let:trip {trip} />
		<li slot="placeholder">You have no trips yet!</li>
	</TripsList>
</section>
<Notification message={error} {severity} />

<style>
	section {
		min-width: 300px;
	}

	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	@media (min-width: 800px) {
		section {
			min-width: 500px;
		}

		h3 {
			font-size: 1.5rem;
			margin-top: 1rem;
		}

		img {
			border-radius: 25px;
			max-width: 150px;
		}
	}
</style>
