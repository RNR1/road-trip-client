<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { TripPlans } from '$api/methods';
	import { browser } from '$app/env';

	export const load: Load = async ({ page, fetch }) => {
		try {
			const tripPlan: TripPlan = browser
				? await TripPlans.plan({ fetch }, page.query.get('planId'))
				: undefined;
			return { status: 200, props: { plan: tripPlan } };
		} catch (err) {
			return { status: 302, redirect: '/404' };
		}
	};
</script>

<script lang="ts">
	import Map from '$components/Map';
	import Notification from '$components/Notification';
	import { PlacesAutocompleteInput } from '$components/forms';
	import { APP_NAME } from '$config/constants';
	import { isEmpty } from '$utils/validation';
	import { onMount } from 'svelte';
	import Button from '$components/Button/Button.svelte';
	import type { TripPlan, Waypoint } from '$typings/trips';
	import type { Status } from '$typings/common';

	export let plan: TripPlan | null = null;
	let isGettingDirections: boolean = false;
	let isSaving: boolean = false;
	let isFormVisible: boolean = true;
	let disabled: boolean = false;
	let map: google.maps.Map;
	let ready: boolean = false;
	let origin: HTMLInputElement | null = null;
	let waypoints: Waypoint[] = [...plan.waypoints];
	let destination: HTMLInputElement | null = null;
	let results: google.maps.DirectionsResult | null = null;
	let avoidTolls: boolean = false;
	let message: string = '';
	let severity: Status | null = null;

	async function getDirection(request: Partial<google.maps.DirectionsRequest> = {}) {
		const service = new google.maps.DirectionsService();
		const renderer = new google.maps.DirectionsRenderer({
			map,
			markerOptions: { animation: google.maps.Animation.DROP, cursor: 'pointer' }
		});
		plan = {
			_id: plan?._id,
			destination: destination.value,
			origin: origin.value,
			waypoints: waypoints.map(({ input, ...waypoint }) => ({
				...waypoint,
				location: input.value
			}))
		};
		results = await service.route({
			...request,
			destination: destination.value,
			origin: origin.value,
			waypoints: plan.waypoints.map(({ _id, ...waypoint }) => ({ ...waypoint })),
			travelMode: google.maps.TravelMode.DRIVING,
			avoidTolls
		});

		renderer.setDirections(results);
		toggleForm();
	}

	const addStop = () => {
		waypoints = [
			...waypoints,
			{ _id: Date.now().toString(), input: null, location: '', stopover: true }
		];
	};

	enum Direction {
		UP = -1,
		DOWN = 1
	}

	const swapWaypoint = (index: number, direction: Direction) => {
		const swapper = [...waypoints];
		[swapper[index], swapper[index + direction]] = [swapper[index + direction], swapper[index]];
		waypoints = [...swapper];
	};

	const toggleForm = () => {
		isFormVisible = !isFormVisible;
	};

	const getDuration = (legs: google.maps.DirectionsLeg[] = []) => {
		const duration = new Date(
			legs.reduce((prev, current) => prev + current.duration.value * 1000, 0)
		);
		const hours = duration.getUTCHours();
		return `${hours} Hours, ${hours - duration.getUTCMinutes()} Minutes`;
	};

	$: duration = getDuration(results?.routes?.[0].legs);
	$: distance = new Intl.NumberFormat('en-US', {
		style: 'unit',
		unit: 'mile',
		unitDisplay: 'long',
		maximumFractionDigits: 0
	}).format(
		results?.routes[0]?.legs.reduce((prev, current) => prev + current.distance.value / 1609.344, 0)
	);

	const onSubmit = async () => {
		isGettingDirections = true;
		try {
			await getDirection();
		} catch (error) {
			if (error.code === google.maps.DirectionsStatus.NOT_FOUND)
				message = 'At least one of the origin, destination, or stops could not be found.';
			severity = 'error';
		} finally {
			isGettingDirections = false;
		}
	};

	const isValid = () => {
		disabled = isEmpty(origin?.value) || isEmpty(destination?.value);
	};

	onMount(() => {
		isValid();
	});

	const removeOnBackspace = (e: KeyboardEvent, id: string) => {
		if (e.key !== 'Backspace' || (e.currentTarget as HTMLInputElement).value !== '') return;
		waypoints = waypoints.filter(({ _id }) => _id !== id);
	};

	const savePlan = async () => {
		try {
			isSaving = true;
			const { message: msg } = await TripPlans.save(plan._id, plan);
			message = msg;
			severity = 'success';
		} catch (error) {
		} finally {
			isSaving = false;
		}
	};
</script>

<svelte:head>
	<title>{APP_NAME} • Trip planner</title>
</svelte:head>
<Map bind:map bind:ready>
	<section slot="overlay" class="overlay">
		{#if isFormVisible}
			<form on:input={isValid} on:submit|preventDefault={onSubmit}>
				<section class="waypoints">
					<PlacesAutocompleteInput
						placeholder="Enter your origin"
						bind:input={origin}
						bind:ready
						value={plan?.origin}
					/>
					{#each waypoints as { _id, input = null, location }, i (_id)}
						<div class="waypoint">
							<PlacesAutocompleteInput
								bind:ready
								placeholder={`Stop #${i + 1}`}
								bind:input
								on:keydown={(e) => removeOnBackspace(e, _id)}
								value={plan?.waypoints?.[i]?.location ?? location}
							/>
							<button
								disabled={i === 0}
								type="button"
								class="material-icons"
								on:click={() => swapWaypoint(i, Direction.UP)}>arrow_upward</button
							>
							<button
								type="button"
								class="material-icons"
								disabled={i === waypoints.length - 1}
								on:click={() => swapWaypoint(i, Direction.DOWN)}>arrow_downward</button
							>
						</div>
					{/each}
					<PlacesAutocompleteInput
						bind:ready
						placeholder="Enter your destination"
						bind:input={destination}
						value={plan?.destination}
					/>
				</section>
				<section class="actions">
					<Button loading={isGettingDirections} variant="success outline" {disabled} type="submit"
						>Search</Button
					>
					<Button variant="outline" type="button" on:click={addStop}>Add stop</Button>
				</section>
			</form>
		{:else}
			<Button variant="outline" on:click={toggleForm}>Change plan</Button>
			<Button loading={isSaving} variant="success" on:click={savePlan}>Save plan</Button>
		{/if}
		{#if results}
			<div>
				<p>Total Duration: {duration}</p>
				<p>Total Distance: {distance}</p>
			</div>
		{/if}
	</section>
</Map>
<Notification open={Boolean(message)} bind:message bind:severity />

<style>
	.overlay {
		position: absolute;
		top: 60px;
		left: 10px;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.7);
	}

	.waypoint,
	button {
		margin-top: 10px;
		border: none;
	}

	.waypoint {
		display: flex;
	}

	.waypoint button {
		padding: 0.25rem 0;
		background: white;
		margin: 0;
		cursor: pointer;
	}

	form {
		max-width: 250px;
	}

	.waypoints {
		max-height: 50vh;
		overflow: scroll;
	}
	.actions {
		margin-top: 0.5rem;
		display: flex;
		justify-content: space-between;
	}
</style>
