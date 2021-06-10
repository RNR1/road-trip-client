<script lang="ts">
	import { GOOGLE_API_KEY } from '$config/constants';

	let ready: boolean = false;
	let container: HTMLDivElement;
	let map: google.maps.Map;
	let zoom = 8;
	let center = { lat: -34.397, lng: 150.644 };

	function onLoad() {
		ready = true;
	}

	$: if (ready && !map) {
		map = new google.maps.Map(container, {
			zoom,
			center
		});
	}
</script>

<svelte:head>
	<script
		defer
		async
		on:load={onLoad}
		src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`}>
	</script>
</svelte:head>
<div bind:this={container} id="map" />

<style>
	#map {
		width: 100vw;
		height: calc(100vh - 85px);
	}
</style>
