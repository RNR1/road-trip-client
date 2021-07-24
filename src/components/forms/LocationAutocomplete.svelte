<script lang="ts">
	import { onDestroy } from 'svelte';
	import ErrorMessage from './ErrorMessage.svelte';
	import { GOOGLE_API_KEY } from '$config/constants';

	export let label: string;
	export let name: string;
	export let placeholder: string = '';
	export let ready: boolean = false;
	export let input: HTMLInputElement | null = null;
	export let value: string = '';
	export let valid: boolean = true;
	export let errorMessage = '';
	export let required = false;
	let touched: boolean = false;
	let listener: google.maps.MapsEventListener | null = null;

	$: if (ready && input) {
		new google.maps.places.Autocomplete(input, { componentRestrictions: { country: 'USA' } });
		listener = google.maps.event.addDomListener(input, 'keydown', (e: KeyboardEvent) => {
			if (e.key !== 'Enter') return;
			const dropdowns = Array.from(document?.querySelectorAll<HTMLDivElement>('.pac-container'));
			if (dropdowns.some((dropdown) => dropdown.style.display === '')) e.preventDefault();
		});
	}

	function setTouched() {
		touched = true;
	}

	function onLoad() {
		ready = true;
	}

	onDestroy(() => {
		listener?.remove();
		window.google = undefined;
	});
</script>

<svelte:head>
	<script
		defer
		async
		on:load={onLoad}
		src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places,directions`}>
	</script>
</svelte:head>

<div class="form-control">
	<label for={name}>
		{label}
		{#if required}
			<sup>*</sup>
		{/if}
	</label>

	<input
		class:invalid={!valid && touched}
		on:keydown
		bind:this={input}
		type="text"
		{placeholder}
		{value}
		on:blur={setTouched}
	/>
</div>
<ErrorMessage>
	{#if errorMessage && !valid && touched}
		{errorMessage}
	{/if}
</ErrorMessage>

<style>
	input {
		display: block;
		width: 100%;
		font: inherit;
		border: none;
		border-bottom: 2px solid #ccc;
		border-radius: 10px;
		background: white;
		padding: 0.5rem 0.25rem;
		transition: border-color 0.1s ease-out;
	}

	input:focus {
		border-color: #e40763;
		outline: none;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		width: 100%;
	}

	.form-control {
		margin: 0.5rem 0.25rem;
		width: 100%;
	}

	.invalid {
		border-color: red;
		background: #fde3e3;
	}

	sup {
		color: red;
	}
</style>
