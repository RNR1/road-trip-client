<script lang="ts" context="module">
	import { authGuard } from '$lib/guards';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page, fetch, session, context }) => {
		return await authGuard({ page, fetch, session, context });
	};
</script>

<script lang="ts">
	import Header from '$components/Header';
</script>

<Header />
<main>
	<slot />
</main>
