<script lang="ts" context="module">
	import auth from '$data/auth';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = () => {
		auth.clear();
		return {
			redirect: '/',
			status: 302
		};
	};
</script>
