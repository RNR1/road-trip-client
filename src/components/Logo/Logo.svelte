<script lang="ts">
	import { APP_NAME, APP_DESCRIPTION } from '$config/constants';
	import MediaQuery from '$components/MediaQuery';

	export let className = 'brand-logo';
</script>

<div>
	<MediaQuery query="(max-width: 500px)" let:matches>
		{#if matches}
			<img
				id="brand-logo"
				class={className}
				src="/icon-black.png"
				alt={`${APP_NAME} - ${APP_DESCRIPTION}`}
			/>
		{:else}
			<img
				id="brand-logo"
				class={className}
				src="/logo_full.png"
				alt={`${APP_NAME} - ${APP_DESCRIPTION}`}
			/>
		{/if}
	</MediaQuery>
</div>

<style>
	div {
		height: 100%;
	}
	img {
		height: 100%;
	}

	@media (max-width: 500px) {
		div {
			padding: 20px;
		}
	}
</style>
