<script lang="ts">
	import { FormControl, ImageInput } from '$components/forms';
	import { IMAGE_SIZE_LIMIT } from '$config/constants';
	import type { Status } from '$typings/common';
	import { readFile } from '$utils/string';
	import { isEmpty } from '$lib/validation';

	export let name: string = '';
	export let description: string = '';
	export let src: string = '';
	export let alt: string = '';

	export let message = '';
	export let severity: Status | null = null;

	$: isNameValid = !isEmpty(name) && name.length >= 4;

	const onSelectFile: svelte.JSX.FormEventHandler<HTMLInputElement> = async (e) => {
		const { files } = e.currentTarget;
		if (!files.length) return;
		if (files[0]?.size > IMAGE_SIZE_LIMIT) {
			message = 'This file is not supported, please upload a smaller file(up to 2MB).';
			severity = 'error';
			return;
		}

		const { data } = await readFile(files[0]);
		src = data as string;
	};
</script>

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
