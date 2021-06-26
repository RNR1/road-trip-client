<script lang="ts">
	import Map from '$components/Map';

	let map: google.maps.Map;

	async function getDirection(request: Omit<google.maps.DirectionsRequest, 'travelMode'>) {
		const service = new google.maps.DirectionsService();
		const renderer = new google.maps.DirectionsRenderer();
		const results = await service.route({
			...request,
			travelMode: google.maps.TravelMode.DRIVING
		});
		renderer.setMap(map);
		renderer.setDirections(results);
	}
</script>

<Map bind:map />
