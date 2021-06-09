<script lang="ts" context="module">
	import { browser } from '$app/env';
	import auth from '$data/auth';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = () => {
		if (browser) auth.clear();
		return { redirect: '/', status: 302 };
	};
</script>
