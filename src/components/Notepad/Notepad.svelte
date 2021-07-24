<script lang="ts">
	import Button from '$components/Button';
	import { FormControl } from '$components/forms';
	import { isEmpty } from '$lib/validation';

	export let title: string = '';
	export let content: string = '';
	export let loading: boolean = false;
</script>

<form on:submit|preventDefault>
	<FormControl name="title" label="Title" bind:value={title} />
	<FormControl variant="textarea" name="note" label="Content" bind:value={content} />
	<Button disabled={isEmpty(content)} {loading} type="submit">Save</Button>
</form>

<style>
	form {
		width: 100%;
	}
</style>
