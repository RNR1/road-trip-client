<script lang="ts">
	import { nameInitials } from '$utils/string';
	import { isEmpty } from '$utils/validation';

	export let name = 'User';
	export let src = '';

	$: label = !isEmpty(name) ? nameInitials(name) : null;
</script>

<figure on:click>
	{#if src}
		<img {src} alt={name} />
	{:else}
		{label}
	{/if}
</figure>

<style>
	figure {
		position: relative;
		margin: auto 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 1.125rem;
		color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		background: #ccc;
		border: 1px solid rgba(0, 0, 0, 0.2);
		min-height: 50px;
		min-width: 50px;
		cursor: pointer;
		transition: all 0.3s;
	}

	figure:hover {
		opacity: 0.7;
	}
</style>
