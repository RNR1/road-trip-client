<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { Trips } from '$api/methods';
	import { browser } from '$app/env';
	import type { Trip } from '$typings/trips';

	export const load: Load = async ({ page, fetch }) => {
		try {
			const trip: Trip = browser ? await Trips.trip({ fetch }, page.params.slug) : undefined;
			if (!trip) throw { message: 'Trip not found' };
			const { _id, name, description, image, slug } = trip;
			return { status: 200, props: { _id, name, description, image, slug } };
		} catch (err) {
			return { status: 302, redirect: '/404' };
		}
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$components/Button';
	import Card from '$components/Card';
	import { APP_NAME } from '$config/constants';
	import type { Status } from '$typings/common';
	import { isEmpty } from '$utils/validation';
	import TripFormValues from '../_TripFormValues.svelte';

	export let _id: string = '';
	export let slug: string = '';
	export let name: string = '';
	export let description: string = '';
	export let image = { src: '', alt: '' };

	let editing = false;
	let deleting = false;
	let message = '';
	let severity: Status;

	$: isNameValid = !isEmpty(name) && name.length >= 4;

	const onSubmit = async () => {
		const body = { name, description, image };
		editing = true;
		severity = 'info';
		message = 'Editing your trip';
		try {
			const { message: notification } = await Trips.edit(slug, body);
			editing = false;
			message = notification;
			severity = 'success';
			await goto(`/trips/${slug}`);
		} catch (err) {
			editing = false;
			message = err.message;
			severity = 'error';
		}
	};

	const onDelete = async () => {
		deleting = true;
		severity = 'info';
		message = 'Editing your trip';
		try {
			const { message: notification } = await Trips.delete(_id);
			deleting = false;
			message = notification;
			severity = 'success';
			await goto(`/trips`);
		} catch (err) {
			editing = false;
			message = err.message;
			severity = 'error';
		}
	};
</script>

<svelte:head>
	<title>{APP_NAME} • Edit your trip</title>
</svelte:head>
<Card>
	<form on:submit|preventDefault={onSubmit}>
		<h2>Edit your trip</h2>
		<TripFormValues bind:name bind:description bind:src={image.src} bind:alt={image.alt} />
		<div>
			<Button variant="success" disabled={!isNameValid} loading={editing} type="submit">Save</Button
			>
			<Button disabled={!isNameValid} loading={deleting} type="button" on:click={onDelete}
				>Delete</Button
			>
		</div>
	</form>
</Card>
