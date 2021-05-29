<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				title: `${status}: ${error.message}`
			}
		};
	}
</script>

<script>
	import Modal from '$components/Modal';
	export let title;
</script>

<Modal title="Error">{title}</Modal>
