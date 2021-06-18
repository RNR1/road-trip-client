<script lang="ts">
	import Card from '$components/Card';
	import { PLACEHOLDER_IMAGE } from '$config/constants';
	import type { Trip } from '$typings/trips';

	export let trip: Trip | null = null;
</script>

<li>
	<Card>
		<a sveltekit:prefetch href={`/trips/${trip?.slug}`}>
			<img
				src={trip?.image?.src ?? PLACEHOLDER_IMAGE.src}
				alt={trip?.image?.alt ?? PLACEHOLDER_IMAGE.alt}
			/>
			<div class="content">
				<h3>{trip?.name ?? 'Trip name'}</h3>
				<p>
					{trip?.participants.length ?? 0}
					{trip?.participants.length === 1 ? 'participant' : 'participants'}
				</p>
			</div>
		</a>
	</Card>
</li>

<style>
	a {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 100%;
		text-decoration: none;
		color: inherit;
	}

	.content {
		flex: 1.2;
		margin-left: 1rem;
	}

	h3 {
		margin: 0;
		padding: 0;
		font-size: 1rem;
		margin-top: 1rem;
	}

	img {
		border-radius: 25px;
		max-width: 100px;
	}
</style>
