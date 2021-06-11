<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { Trips } from '$api/methods';

	export const load: Load = async ({ fetch }) => {
		try {
			const trips = await Trips.list({ fetch });
			return { status: 200, props: { trips } };
		} catch (err) {
			return { status: err.status, props: { error: err.message, severity: 'error' } };
		}
	};
</script>

<script lang="ts">
	import Notification from '$components/Notification';
	import type { Trip } from '$typings/trips';
	import type { Status } from '$typings/common';
	import Card from '$components/Card';

	export let trips: Trip[] = [];
	export let error: string = '';
	export let severity: Status | null = null;
</script>

<section>
	<h2>My Trips</h2>
	<ul>
		{#each trips as { _id, name, slug, image, participants } (_id)}
			<li>
				<Card>
					<a sveltekit:prefetch href={`/trips/${slug}`}>
						<img src={image.src} alt={image.alt} />
						<div class="content">
							<h3>{name}</h3>
							<p>
								{participants.length}
								{participants.length === 1 ? 'participant' : 'participants'}
							</p>
						</div>
					</a>
				</Card>
			</li>
		{:else}
			<li>You have no trips yet!</li>
		{/each}
	</ul>
</section>
<Notification message={error} {severity} />

<style>
	ul {
		list-style: none;
	}

	ul,
	h3 {
		margin: 0;
		padding: 0;
	}

	a {
		display: flex;
		text-decoration: none;
		color: inherit;
	}

	.content {
		margin-left: 1rem;
	}

	h3 {
		font-size: 1rem;
		margin-top: 1rem;
	}

	img {
		border-radius: 25px;
		max-width: 150px;
	}
</style>
