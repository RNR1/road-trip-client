<script lang="ts">
	export let container: HTMLDivElement | null = null;
	export let content: Record<
		'title' | 'duration' | 'distance' | 'exceededHours',
		string | boolean
	> | null = null;
</script>

<div bind:this={container}>
	{#if content}
		<strong>
			{content.title}
		</strong>
		<br />
		<p>
			{content.duration}
		</p>
		<p>
			{content.distance}
		</p>
		{#if content.exceededHours}
			<em>This leg of your trip is longer than you might want to drive.</em>
		{/if}
	{/if}
</div>

<style>
	em {
		color: red;
	}
</style>
