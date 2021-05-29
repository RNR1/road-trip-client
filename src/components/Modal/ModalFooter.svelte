<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$components/Button';

	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	function onClose() {
		dispatch('close');
	}
</script>

<footer>
	<slot>
		<Button on:click={onClose}>Close</Button>
	</slot>
</footer>

<style>
	footer {
		padding: 1rem;
	}
</style>
