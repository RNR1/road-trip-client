<script lang="ts">
	import type { Status } from '$app/typings/common';
	import { onDestroy } from 'svelte';

	export let open: boolean = true;
	export let severity: Status | null = null;
	export let message: string = 'Could not login with the provided credentials';
	let timeout: NodeJS.Timeout;

	$: {
		if (open) {
			timeout = setTimeout(() => {
				message = '';
			}, 4000);
		} else clearTimeout(timeout);
	}

	onDestroy(() => clearTimeout(timeout));
</script>

<dialog {open} class={severity}>
	<span class="material-icons">{severity}</span>
	{message}
</dialog>

<style>
	dialog {
		bottom: 1rem;
		transition: all 0.3s;
		border-radius: 8px;
		transform: translateY(0);
		display: flex;
		align-items: center;
		margin: 0 1rem;
	}
	dialog:not([open]) {
		display: flex;
		transform: translateY(200%);
	}

	@media (min-width: 500px) {
		dialog {
			margin-left: 1rem;
		}
	}

	.material-icons {
		margin-right: 5px;
	}

	.error {
		background: red;
		color: white;
		border-color: transparent;
	}
</style>
