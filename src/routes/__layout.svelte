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
	import { APP_NAME } from '$config/constants';

	export let loading: boolean = false;
</script>

<svelte:head>
	{#if loading}
		<title>{APP_NAME} • Loading...</title>
	{/if}
</svelte:head>
<Header />

<main>
	{#if loading}
		<Loader />
	{:else}
		<slot />
	{/if}
</main>
