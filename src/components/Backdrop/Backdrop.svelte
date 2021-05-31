<script lang="ts">
	import { fade } from 'svelte/transition';

	export let transparent: boolean = false;
</script>

<div class:transparent transition:fade={{ duration: 200 }} on:click />

<style>
	div {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.75);
		z-index: 10;
	}

	.transparent {
		background-color: transparent;
	}
</style>
