<script lang="ts">
	import { Trips } from '$api/methods';
	import { goto } from '$app/navigation';
	import Button from '$components/Button';
	import Card from '$components/Card';
	import { APP_NAME } from '$config/constants';
	import type { Status } from '$typings/common';
	import { isEmpty } from '$lib/validation';
	import TripFormValues from './_TripFormValues.svelte';

	let name: string = '';
	let description: string = '';
	let src: string = '';
	let alt: string = '';
	let loading = false;
	let message = '';
	let severity: Status;

	$: isNameValid = !isEmpty(name) && name.length >= 4;

	const onSubmit = async () => {
		const body = { name, description, image: { src, alt } };
		loading = true;
		severity = 'info';
		message = 'Creating your trip';
		try {
			const { message: notification, slug } = await Trips.add(body);
			loading = false;
			message = notification;
			severity = 'success';
			await goto(`/trips/${slug}`);
		} catch (err) {
			loading = false;
			message = err.message;
			severity = 'error';
		}
	};
</script>

<svelte:head>
	<title>{APP_NAME} • Create your trip</title>
</svelte:head>
<Card>
	<form on:submit|preventDefault={onSubmit}>
		<h2>Create a new trip</h2>
		<TripFormValues bind:name bind:description bind:src bind:alt />
		<Button disabled={!isNameValid} {loading} type="submit">Add trip</Button>
	</form>
</Card>
