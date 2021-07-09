<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import PlacesAutocompleteInput from './PlacesAutocompleteInput.svelte';

	export let input: HTMLInputElement | null = null;
	export let ready: boolean = false;
	export let i: number = 0;
	export let value: string = '';
	export let isLastItem: boolean = false;

	const dispatch = createEventDispatcher<{ 'swap-up': void; 'swap-down': void }>();
	const onSwapUp = () => dispatch('swap-up');
	const onSwapDown = () => dispatch('swap-down');
</script>

<div class="waypoint">
	<PlacesAutocompleteInput
		bind:input
		bind:ready
		hintId="waypoints-hint"
		placeholder={`Stop #${i + 1}`}
		on:keydown
		bind:value
	/>
	<button disabled={i === 0} type="button" class="material-icons" on:click={onSwapUp}
		>arrow_upward</button
	>
	<button type="button" class="material-icons" disabled={isLastItem} on:click={onSwapDown}
		>arrow_downward</button
	>
</div>

<style>
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
