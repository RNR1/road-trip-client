<script lang="ts">
	import { onMount } from 'svelte';
	import type { TripPlan, Waypoint } from '$typings/trips';
	import { isEmpty } from '$lib/validation';
	import { PlacesAutocompleteInput } from '$components/forms';
	import Button from '$components/Button/Button.svelte';
	import WaypointControl from '$components/forms/WaypointControl.svelte';
	import RangeInput from '$components/forms/RangeInput.svelte';

	export let plan: TripPlan | null = null;
	export let ready: boolean = false;
	export let isGettingDirections: boolean = false;

	export let origin: HTMLInputElement | null = null;
	export let waypoints: Waypoint[] = [...plan.waypoints];
	export let destination: HTMLInputElement | null = null;
	export let maxHoursPerDay: number = plan.maxHoursPerDay ?? 5;

	let disabled: boolean = false;

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

	enum Direction {
		UP = -1,
		DOWN = 1
	}

	const swapWaypoint = (index: number, direction: Direction) => {
		const swapper = [...waypoints];
		[swapper[index], swapper[index + direction]] = [swapper[index + direction], swapper[index]];
		waypoints = [...swapper];
	};

	const addStop = () => {
		waypoints = [
			...waypoints,
			{ _id: Date.now().toString(), input: null, location: '', stopover: true }
		];
	};
</script>

<form on:input={isValid} on:submit|preventDefault>
	<section class="waypoints">
		<PlacesAutocompleteInput
			placeholder="Enter your origin"
			bind:input={origin}
			bind:ready
			value={plan?.origin}
		/>
		{#each waypoints as { _id, input = null, location }, i (_id)}
			<WaypointControl
				bind:input
				bind:ready
				{i}
				isLastItem={i === waypoints.length - 1}
				value={plan?.waypoints?.[i]?.location ?? location}
				on:keydown={(e) => removeOnBackspace(e, _id)}
				on:swap-up={() => swapWaypoint(i, Direction.UP)}
				on:swap-down={() => swapWaypoint(i, Direction.DOWN)}
			/>
		{/each}
		<PlacesAutocompleteInput
			bind:ready
			placeholder="Enter your destination"
			bind:input={destination}
			value={plan?.destination}
		/>
	</section>
	<RangeInput
		name="maxHoursPerDay"
		label="Maximum driving hours per day"
		max={15}
		min={1}
		bind:value={maxHoursPerDay}
	/>
	{#if waypoints.length}
		<article id="waypoints-hint">* Use backspace on an empty waypoint to remove it</article>
	{/if}
	<section class="actions">
		<Button loading={isGettingDirections} variant="success outline" {disabled} type="submit"
			>Search</Button
		>
		<Button variant="outline" type="button" on:click={addStop}>Add stop</Button>
	</section>
</form>

<style>
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

	#waypoints-hint {
		font-size: 0.6rem;
		margin: 0.5rem 0;
	}
</style>
