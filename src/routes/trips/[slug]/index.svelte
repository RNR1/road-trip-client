<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { Notes, Trips } from '$api/methods';
	import { browser } from '$app/env';
	import { APP_NAME, PLACEHOLDER_IMAGE } from '$config/constants';
	import type { Trip } from '$typings/trips';

	export const load: Load = async ({ page, fetch }) => {
		try {
			const trip: Trip = browser ? await Trips.trip({ fetch }, page.params.slug) : undefined;
			if (!trip && browser) throw { message: 'Trip not found' };
			return { status: 200, props: { trip } };
		} catch (err) {
			return { status: 302, redirect: '/404' };
		}
	};
</script>

<script lang="ts">
	import Notification from '$components/Notification';
	import Notepad from '$components/Notepad';
	import NotesList from '$components/NotesList';
	import ParticipantsList from '$components/ParticipantsList';
	import type { Status } from '$typings/common';
	import { isEmpty } from '$utils/validation';
	import type { NotePayload } from '$typings/notes';

	export let trip: Trip | null = null;
	let image = trip.image ?? PLACEHOLDER_IMAGE;

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

<svelte:head>
	<title>{APP_NAME} • {trip?.name}</title>
</svelte:head>
<div class="title">
	<h2>{trip?.name ?? 'Trip Name'}</h2>
	<a sveltekit:prefetch href={`/trips/${trip.slug}/edit`} class="material-icons">edit</a>
</div>
<img src={image.src} alt={image.alt} />
<p>"{trip.description}"</p>
<section>
	<h3>Participants:</h3>
	<ParticipantsList inviteLink={`/trips/${trip.slug}/invite`} participants={trip?.participants} />
</section>

<section>
	<h4>Notes</h4>
	<NotesList notes={trip.notes} on:edit={onEdit} on:delete={onDelete} />
	<Notepad bind:title bind:content bind:loading={saving} on:submit={onSubmit} />
</section>
<Notification open={!isEmpty(message)} bind:message bind:severity />

<style>
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	@media (max-width: 500px) {
		.title {
			flex-direction: column;
		}
		.material-icons {
			align-self: flex-end;
		}
	}
	h2 {
		font-size: 2rem;
		width: 100%;
		margin: 20px 60px;
	}

	h3,
	h4 {
		font-size: 1.5rem;
		width: 100%;
		margin: 20px 0;
	}
	section {
		justify-self: flex-start;
		width: 100%;
	}
	img {
		border-radius: 6px;
	}

	.material-icons {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		color: inherit;
		height: 40px;
		width: 40px;
		padding: 1rem;
		cursor: pointer;
		border-radius: 50%;
		box-shadow: 0px 10px 17.869px rgba(0, 0, 0, 0.0417275), 0px -3px 10.0172px rgba(0, 0, 0, 0.035),
			0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725),
			0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802);
	}
</style>
