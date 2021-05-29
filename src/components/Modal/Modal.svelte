<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import Backdrop from '$components/Backdrop';
	import ModalTitle from './ModalTitle.svelte';
	import ModalContent from './ModalContent.svelte';
	import ModalFooter from './ModalFooter.svelte';

	export let title: string = 'Title';
	const dispatch = createEventDispatcher<{
		'backdrop-click': void;
	}>();

	function onBackdropClick() {
		dispatch('backdrop-click');
	}
</script>

<Backdrop on:click={onBackdropClick} />
<div transition:fly={{ duration: 200, y: 300 }} class="modal">
	<ModalTitle>{title}</ModalTitle>
	<ModalContent><slot /></ModalContent>
	<ModalFooter on:close><slot name="footer" /></ModalFooter>
</div>

<style>
	.modal {
		position: fixed;
		top: 10vh;
		left: 10%;
		width: 80%;
		max-height: 80vh;
		background: white;
		border-radius: 5px;
		z-index: 100;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
		overflow: scroll;
	}
	@media (min-width: 768px) {
		.modal {
			width: 40rem;
			left: calc(50% - 20rem);
		}
	}
</style>
