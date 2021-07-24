<script lang="ts">
	export let href: string = '';
	export let title: string = '';
	export let icon: string = '';
</script>

<a {title} {href} aria-label={title} sveltekit:prefetch class="material-icons">{icon}</a>

<style>
	a.material-icons {
		transition: all 0.3s;
		margin: 0.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		color: inherit;
		height: 40px;
		width: 40px;
		padding: 1rem;
		cursor: pointer;
		border-radius: 50%;
		box-shadow: 0px 10px 17.869px rgba(0, 0, 0, 0.0417275), 0px -3px 10.0172px rgba(0, 0, 0, 0.035),
			0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725),
			0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802);
	}
	a:hover {
		background: #eee;
	}
</style>
