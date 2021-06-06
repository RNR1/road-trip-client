<script lang="ts" context="module">
	import auth from '$data/auth';
	import type { Load } from '@sveltejs/kit';
	import { browser } from '$app/env';

	export const load: Load = async ({ fetch }) => {
		try {
			if (browser) auth.verify({ fetch });
			return { status: 200 };
		} catch (error) {
			return { status: 302, redirect: '/logout' };
		}
	};
</script>

<script lang="ts">
	import Header from '$components/Header';
</script>

<Header />
<main>
	<slot />
</main>
