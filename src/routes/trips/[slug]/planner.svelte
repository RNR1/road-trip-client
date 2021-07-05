<script lang="ts">
	import Map from '$components/Map';
	import PlaceAutocompleteInput from '$components/forms/PlaceAutocompleteInput.svelte';
	import { APP_NAME } from '$config/constants';
	import { isEmpty } from '$utils/validation';

	let isFormVisible: boolean = true;
	let disabled: boolean = false;
	let map: google.maps.Map;
	let ready: boolean = false;
	let origin: HTMLInputElement | null = null;
	let waypoints: {
		id: number;
		input: HTMLInputElement | null;
		location: string;
		stopover: boolean;
	}[] = [];
	let destination: HTMLInputElement | null = null;
	let results: google.maps.DirectionsResult | null = null;
	let avoidTolls: boolean = false;

	async function getDirection(request: Partial<google.maps.DirectionsRequest>) {
		const service = new google.maps.DirectionsService();
		const renderer = new google.maps.DirectionsRenderer({
			map,
			markerOptions: { animation: google.maps.Animation.DROP, cursor: 'pointer' }
		});
		results = await service.route({
			...request,
			destination: destination.value,
			origin: origin.value,
			waypoints: waypoints.map(({ id, input, ...waypoint }) => ({
				...waypoint,
				location: input.value
			})),
			travelMode: google.maps.TravelMode.DRIVING,
			avoidTolls
		});
		console.log(results);
		renderer.setDirections(results);
	}

	const addStop = () => {
		waypoints = [...waypoints, { id: Date.now(), input: null, location: '', stopover: true }];
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

	const onSubmit = () => getDirection({});

	const isValid = () => {
		disabled = isEmpty(origin?.value) || isEmpty(destination?.value);
	};
</script>

<svelte:head>
	<title>{APP_NAME} • Trip planner</title>
</svelte:head>
<Map bind:map bind:ready>
	<section slot="overlay" class="overlay">
		{#if isFormVisible}
			<form on:input={isValid} on:submit|preventDefault={onSubmit}>
				<PlaceAutocompleteInput placeholder="Enter your origin" bind:input={origin} bind:ready />
				{#each waypoints as { id, input }, i (id)}
					<div class="waypoint">
						<PlaceAutocompleteInput bind:ready placeholder={`Stop #${i + 1}`} bind:input />
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
				<PlaceAutocompleteInput
					bind:ready
					placeholder="Enter your destination"
					bind:input={destination}
				/>
				<button {disabled} type="submit">Search</button>
				<button type="button" on:click={addStop}>Add stop</button>
			</form>
		{:else}
			<button on:click={toggleForm}>Change plan</button>
		{/if}
		{#if results}
			<div>
				<p>Total Duration: {duration}</p>
				<p>Total Distance: {distance}</p>
			</div>
		{/if}
	</section>
</Map>

<style>
	.overlay {
		position: absolute;
		top: 60px;
		left: 10px;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.6);
	}

	form {
		display: flex;
		flex-direction: column;
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
</style>
