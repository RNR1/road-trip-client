<script lang="ts">
	import type { Note, NotePayload } from '$typings/notes';
	import { isEmpty } from '$utils/validation';
	import { summarizeText } from '$utils/string';
	import { createEventDispatcher } from 'svelte';

	export let notes: Note[] = [];

	const dispatch = createEventDispatcher<{ edit: NotePayload; delete: string }>();
</script>

<ul>
	{#each notes as { _id, title, content, updatedAt } (_id)}
		<li>
			<p>
				{isEmpty(title) ? summarizeText(content, 20) : title}<br />
				<time datetime={updatedAt}
					>({new Date(updatedAt).toLocaleDateString('en-US', {
						hour12: true,
						hour: '2-digit',
						minute: '2-digit'
					})})
				</time>
			</p>
			<div class="actions">
				<div
					role="button"
					class="material-icons"
					on:click={() => dispatch('edit', { _id, title, content })}
				>
					edit
				</div>
				<div role="button" class="material-icons" on:click={() => dispatch('delete', _id)}>
					delete
				</div>
			</div>
		</li>
	{:else}
		<li>You haven't added any notes to this trip yet</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 1rem 0;
		padding: 0;
		width: 100%;
		max-width: 500px;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0px 10px 17.869px rgba(0, 0, 0, 0.0417275), 0px -3px 10.0172px rgba(0, 0, 0, 0.035),
			0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725),
			0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802);
		margin: 0 0.5rem;
		border-radius: 12px;
		padding: 0.5rem;
	}

	time {
		font-size: 0.875rem;
	}

	.actions {
		display: flex;
		align-items: center;
	}

	.material-icons {
		padding: 0 0.5rem;
		cursor: pointer;
	}
</style>
