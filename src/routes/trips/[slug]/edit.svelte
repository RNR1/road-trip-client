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
	import { FormControl, ImageInput } from '$components/forms';
	import { APP_NAME, IMAGE_SIZE_LIMIT } from '$config/constants';
	import type { Status } from '$typings/common';
	import { readFile } from '$utils/string';
	import { isEmpty } from '$utils/validation';

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

	const onSelectFile: svelte.JSX.FormEventHandler<HTMLInputElement> = async (e) => {
		const { files } = e.currentTarget;
		if (!files.length) return;
		if (files[0]?.size > IMAGE_SIZE_LIMIT) {
			message = 'This file is not supported, please upload a smaller file(up to 2MB).';
			return;
		}

		const { data } = await readFile(files[0]);
		image.src = data as string;
	};

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
		<FormControl
			label="Trip Name"
			name="name"
			valid={isNameValid}
			errorMessage="We need at least 4 characters"
			placeholder="Coast to coast ride..."
			required
			bind:value={name}
		/>
		<FormControl
			variant="textarea"
			label="A few words about your trip"
			name="description"
			placeholder="Anything you want to add about your trip"
			bind:value={description}
		/>
		<ImageInput bind:src={image.src} bind:alt={image.alt} on:change={onSelectFile} />
		<FormControl
			variant="textarea"
			label="Image alt information (optional)"
			name="alt"
			placeholder="describe the image you uploaded"
			bind:value={image.alt}
		/>
		<div>
			<Button variant="success" disabled={!isNameValid} loading={editing} type="submit">Save</Button
			>
			<Button disabled={!isNameValid} loading={deleting} type="button" on:click={onDelete}
				>Delete</Button
			>
		</div>
	</form>
</Card>
