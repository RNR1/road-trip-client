<script lang="ts">
	import { onDestroy } from 'svelte';

	export let placeholder: string = '';
	export let ready: boolean = false;
	export let input: HTMLInputElement | null = null;
	export let value: string = '';
	let listener: google.maps.MapsEventListener | null = null;

	$: if (ready && input) {
		new google.maps.places.Autocomplete(input, { componentRestrictions: { country: 'USA' } });
		listener = google.maps.event.addDomListener(input, 'keydown', (e: KeyboardEvent) => {
			if (e.key !== 'Enter') return;
			const dropdowns = Array.from(document?.querySelectorAll<HTMLDivElement>('.pac-container'));
			if (dropdowns.some((dropdown) => dropdown.style.display === '')) e.preventDefault();
		});
	}

	onDestroy(() => listener?.remove());
</script>

<input on:keydown bind:this={input} type="text" {placeholder} {value} />

<style>
	input {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: none;
		width: 100%;
	}

	input:not(:first-of-type) {
		margin-top: 10px;
		border: none;
	}
</style>
