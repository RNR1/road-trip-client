<script lang="ts" context="module">
	import { authGuard } from '$lib/guards';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page, fetch, session, context }) => {
		return await authGuard({ page, fetch, session, context });
	};
</script>

<script lang="ts">
	import Loader from '$components/Loader';
	import Header from '$components/Header';

	export let loading: boolean = false;
</script>

<Header />

<main>
	{#if loading}
		<Loader />
	{:else}
		<slot />
	{/if}
</main>
