<script lang="ts">
	export let container: HTMLDivElement | null = null;
	export let content: Record<'title' | 'duration' | 'distance', string> | null = null;
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
	{/if}
</div>
