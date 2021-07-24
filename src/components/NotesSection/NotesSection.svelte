<script lang="ts">
	import { Notes } from '$api/methods';
	import Notepad from '$components/Notepad';
	import NotesList from '$components/NotesList';
	import Notification from '$components/Notification';
	import type { Status } from '$typings/common';
	import type { NotePayload } from '$typings/notes';
	import type { Trip } from '$typings/trips';
	import { isEmpty } from '$lib/validation';

	export let trip: Trip | null = null;
	let noteId: string;
	let title: string = '';
	let content: string = '';

	let saving: boolean = false;
	let message: string = '';
	let severity: Status | null = null;

	const onEdit = ({ detail }: CustomEvent<NotePayload>) => {
		noteId = detail._id;
		title = detail.title;
		content = detail.content;
	};

	const fetchNotes = async () => {
		const notes = await Notes.list({ trip: trip._id });
		trip.notes = notes;
	};

	const onDelete = async ({ detail }: CustomEvent<string>) => {
		await Notes.remove(detail);
		await fetchNotes();
		noteId = undefined;
	};

	const onSubmit = async () => {
		try {
			saving = true;
			const { message: msg } = noteId
				? await Notes.edit(noteId, { title, content })
				: await Notes.add({ title, content, trip: trip._id });
			await fetchNotes();
			saving = false;
			message = msg;
			noteId = undefined;
			title = '';
			content = '';
			severity = 'success';
		} catch (error) {
			saving = false;
			message = error.message;
			severity = 'error';
		}
	};
</script>

<section>
	<h4>Notes</h4>
	<NotesList notes={trip.notes} on:edit={onEdit} on:delete={onDelete} />
	<Notepad bind:title bind:content bind:loading={saving} on:submit={onSubmit} />
</section>
<Notification open={!isEmpty(message)} bind:message bind:severity />

<style>
	section {
		width: 100%;
		max-width: 500px;
		justify-self: start;
	}
</style>
