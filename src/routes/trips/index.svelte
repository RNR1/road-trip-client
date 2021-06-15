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
	import Button from '$components/Button';
	import Notification from '$components/Notification';
	import type { Trip } from '$typings/trips';
	import type { Status } from '$typings/common';
	import Card from '$components/Card';
	import { APP_NAME, PLACEHOLDER_IMAGE } from '$config/constants';

	export let trips: Trip[] = [];
	export let error: string = '';
	export let severity: Status | null = null;
</script>

<svelte:head>
	<title>{APP_NAME} • My trips</title>
</svelte:head>
<section>
	<div class="title">
		<h2>My Trips</h2>
		<Button href="/trips/new" variant="rounded">+</Button>
	</div>
	<ul>
		{#each trips as { _id, name, slug, image, participants } (_id)}
			<li>
				<Card>
					<a sveltekit:prefetch href={`/trips/${slug}`}>
						<img
							src={image.src ?? PLACEHOLDER_IMAGE.src}
							alt={image.alt ?? PLACEHOLDER_IMAGE.alt}
						/>
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
	section {
		min-width: 300px;
	}
	@media (min-width: 800px) {
		section {
			min-width: 500px;
		}
	}
	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
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
		justify-content: space-between;
		width: 100%;
		height: 100%;
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
		max-width: 100px;
	}
</style>
