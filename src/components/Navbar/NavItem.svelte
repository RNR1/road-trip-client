<script lang="ts">
	export let href: string = '';
	export let icon: string = 'info';
	export let label: string = 'Label';
</script>

<a sveltekit:prefetch {href}>
	<span class="material-icons">{icon}</span>
	<span class="label">{label}</span>
</a>

<style>
	a {
		color: #333 !important;
		display: flex;
		padding: 1rem 0.5rem;
		align-items: center;
		justify-content: space-around;
		height: 100%;
		width: 100%;
		border-radius: inherit;
	}

	a:hover,
	a:active {
		text-decoration: none;
		background: #ccc;
	}

	.label {
		width: 100%;
		padding: 0 2rem;
	}

	.material-icons {
		margin-right: 10px;
	}
</style>
