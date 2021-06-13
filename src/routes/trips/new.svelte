<script lang="ts">
	import { Trips } from '$api/methods';
	import { goto } from '$app/navigation';
	import Button from '$components/Button';
	import Card from '$components/Card';
	import { FormControl, ImageInput } from '$components/forms';
	import { APP_NAME, IMAGE_SIZE_LIMIT } from '$config/constants';
	import type { Status } from '$typings/common';
	import { readFile } from '$utils/string';
	import { isEmpty } from '$utils/validation';

	let name: string = '';
	let description: string = '';
	let src: string = '';
	let alt: string = '';
	let loading = false;
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
		src = data as string;
	};

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
		<ImageInput bind:src bind:alt on:change={onSelectFile} />
		<FormControl
			variant="textarea"
			label="Image alt information (optional)"
			name="alt"
			placeholder="describe the image you uploaded"
			bind:value={alt}
		/>
		<Button disabled={!isNameValid} {loading} type="submit">Add trip</Button>
	</form>
</Card>
