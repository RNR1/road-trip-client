<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { TripPlans } from '$api/methods';
	import { browser } from '$app/env';

	export const load: Load = async ({ page, fetch }) => {
		try {
			const tripPlan: TripPlan = browser
				? await TripPlans.plan({ fetch }, page.query.get('planId'))
				: undefined;
			return { status: 200, props: { plan: tripPlan } };
		} catch (err) {
			return { status: 302, redirect: '/404' };
		}
	};
</script>

<script lang="ts">
	import Button from '$components/Button';
	import Map from '$components/Map';
	import Notification from '$components/Notification';
	import MapPopup from '$components/MapPopup';
	import { APP_NAME } from '$config/constants';
	import { toHoursAndMinutesDuration, toMiles } from '$lib/format';
	import type { TripPlan, Waypoint } from '$typings/trips';
	import type { Status } from '$typings/common';
	import PlanForm from './_PlanForm.svelte';

	export let plan: TripPlan | null = null;
	let isGettingDirections: boolean = false;
	let isSaving: boolean = false;
	let isFormVisible: boolean = true;
	let map: google.maps.Map;
	let ready: boolean = false;

	let origin: HTMLInputElement | null = null;
	let waypoints: Waypoint[] = [...plan.waypoints];
	let destination: HTMLInputElement | null = null;
	let maxHoursPerDay: number = 5;
	let avoidTolls: boolean = false;

	let service: google.maps.DirectionsService | null = null;
	let renderer: google.maps.DirectionsRenderer | null = null;
	let results: google.maps.DirectionsResult | null = null;
	let markers: google.maps.Marker[] = [];
	let listeners: google.maps.MapsEventListener[] = [];
	let infoWindow: google.maps.InfoWindow | null = null;
	let infoWindowContainer: HTMLDivElement | null = null;
	let windowContent: Record<'title' | 'duration' | 'distance', string> | null = null;

	let message: string = '';
	let severity: Status | null = null;

	const onMarkerClick =
		(legs: google.maps.DirectionsLeg[], i: number, isEndAddress = false) =>
		(e: google.maps.MapMouseEvent & { pixel: google.maps.Size }) => {
			if (!infoWindow) infoWindow = new google.maps.InfoWindow();
			const leg = legs[i];
			const nextLeg = isEndAddress ? legs[i + 1] : leg;
			windowContent = {
				title: isEndAddress ? leg.end_address : leg.start_address,
				duration: isEndAddress ? nextLeg?.duration.text ?? 'Destination' : leg.duration.text,
				distance: isEndAddress ? nextLeg?.distance?.text ?? '' : leg.distance.text
			};
			const options: google.maps.InfoWindowOptions = {
				content: infoWindowContainer,
				position: e.latLng,
				pixelOffset: { equals: e.pixel.equals, height: -30, width: 0 }
			};

			infoWindow.close();
			infoWindow.setOptions(options);
			infoWindow.open({ map });
		};

	async function clearMarkers() {
		listeners.forEach((listener) => listener?.remove());
		markers.forEach((marker) => marker.setMap(null));
		listeners.length = 0;
		markers.length = 0;
	}

	async function setMarkers() {
		clearMarkers();
		const MARKER_OPTIONS = { animation: google.maps.Animation.DROP, cursor: 'pointer', map };
		const legs = results.routes?.[0]?.legs;
		legs?.forEach((leg, i) => {
			const startMarker =
				(i !== legs.length - 1 || legs.length === 1) &&
				new google.maps.Marker({
					...MARKER_OPTIONS,
					label: (i + 1).toString(),
					position: leg.start_location
				});
			const endMarker = new google.maps.Marker({
				...MARKER_OPTIONS,
				label: startMarker ? (i + 2).toString() : (i + 2).toString(),
				position: leg.end_location
			});
			if (startMarker) {
				const startListener = startMarker.addListener('click', onMarkerClick(legs, i));
				markers.push(startMarker);
				listeners.push(startListener);
			}
			const endListener = endMarker.addListener('click', onMarkerClick(legs, i, true));
			markers.push(endMarker);
			listeners.push(endListener);
		});
	}

	async function getDirection(request: Partial<google.maps.DirectionsRequest> = {}) {
		if (!service) service = new google.maps.DirectionsService();
		if (!renderer) renderer = new google.maps.DirectionsRenderer({ map, suppressMarkers: true });
		plan = {
			_id: plan?._id,
			destination: destination.value,
			origin: origin.value,
			waypoints: waypoints.map(({ input, ...waypoint }) => ({
				...waypoint,
				location: input.value
			}))
		};
		results = await service.route({
			...request,
			destination: destination.value,
			origin: origin.value,
			waypoints: plan.waypoints.map(({ _id, ...waypoint }) => ({ ...waypoint })),
			travelMode: google.maps.TravelMode.DRIVING,
			avoidTolls
		});

		const exceededHours = results.routes?.[0]?.legs.some(
			(leg) => leg.duration.value > maxHoursPerDay * 3600
		);
		if (exceededHours) {
			message = 'Some legs of your trip are longer than you might want to drive. We recommend adding more stops.';
			severity = 'warning';
		}
		plan = { ...plan, maxHoursPerDay };

		setMarkers();
		renderer.setDirections(results);
		toggleForm();
	}

	const toggleForm = () => {
		isFormVisible = !isFormVisible;
	};

	$: duration = toHoursAndMinutesDuration(
		results?.routes?.[0]?.legs?.reduce((prev, current) => prev + current.duration.value * 1000, 0)
	);
	$: distance = toMiles(
		results?.routes[0]?.legs.reduce((prev, current) => prev + current.distance.value / 1609.344, 0)
	);

	const onSubmit = async () => {
		isGettingDirections = true;
		try {
			infoWindow?.close();
			await getDirection();
		} catch (error) {
			if (error.code === google.maps.DirectionsStatus.NOT_FOUND)
				message = 'At least one of the origin, destination, or stops could not be found.';
			severity = 'error';
		} finally {
			isGettingDirections = false;
		}
	};

	const savePlan = async () => {
		try {
			isSaving = true;
			console.log({ plan });
			const { message: msg } = await TripPlans.save(plan._id, plan);
			message = msg;
			severity = 'success';
		} catch (error) {
			message = error.message;
			severity = 'error';
		} finally {
			isSaving = false;
		}
	};
</script>

<svelte:head>
	<title>{APP_NAME} • Trip planner</title>
</svelte:head>
<Map bind:map bind:ready>
	<section slot="overlay" class="overlay">
		{#if isFormVisible}
			<PlanForm
				bind:ready
				bind:plan
				on:submit={onSubmit}
				bind:isGettingDirections
				bind:origin
				bind:maxHoursPerDay
				bind:destination
				bind:waypoints
			/>
		{:else}
			<Button variant="outline" on:click={toggleForm}>Change plan</Button>
			<Button loading={isSaving} variant="success" on:click={savePlan}>Save plan</Button>
		{/if}
		{#if results}
			<div>
				<p>Total Duration: {duration}</p>
				<p>Total Distance: {distance}</p>
			</div>
		{/if}
	</section>
</Map>
<Notification open={Boolean(message)} bind:message bind:severity />
<MapPopup bind:container={infoWindowContainer} bind:content={windowContent} />

<style>
	.overlay {
		position: absolute;
		top: 60px;
		left: 10px;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.7);
	}
</style>
