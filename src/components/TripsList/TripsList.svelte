<script lang="ts">
	import type { Trip } from '$typings/trips';

	export let trips: Trip[];
</script>

<ul>
	{#each trips as trip (trip._id)}
		<slot name="item" {trip} />
	{:else}
		<slot name="placeholder">
			<li>You have no trips yet!</li>
		</slot>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
</style>
