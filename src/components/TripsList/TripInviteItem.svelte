<script lang="ts">
	import { Trips } from '$api/methods';
	import type { Status } from '$typings/common';
	import Button from '$components/Button';
	import Card from '$components/Card';
	import { PLACEHOLDER_IMAGE } from '$config/constants';
	import type { Trip } from '$typings/trips';
	import { goto } from '$app/navigation';

	export let trip: Trip | null = null;
	let loading: boolean = false;
	let message: string = '';
	let severity: Status | null = null;

	const onClick = async (action: 'join' | 'decline') => {
		try {
			loading = true;
			const response = await Trips.updateInvitation(trip._id, { action });
			loading = false;
			message = response.message;
			severity = 'success';
			await goto(`/trips/${trip?.slug}`);
		} catch (error) {
			loading = false;
			message = error;
			severity = 'error';
		}
	};
</script>

<li>
	<Card>
		<img
			src={trip?.image?.src ?? PLACEHOLDER_IMAGE.src}
			alt={trip?.image?.alt ?? PLACEHOLDER_IMAGE.alt}
		/>
		<div class="content">
			<h3>{trip?.name ?? 'Trip name'}</h3>
			<div class="buttons">
				<Button {loading} type="button" variant="success" on:click={() => onClick('join')}
					>Join</Button
				>
				<Button {loading} type="button" on:click={() => onClick('decline')}>Decline</Button>
			</div>
		</div>
	</Card>
</li>

<style>
	.content {
		flex: 1.2;
		margin-left: 1rem;
	}

	.buttons {
		margin-top: 1rem;
	}

	h3 {
		margin: 0;
		padding: 0;
		font-size: 1rem;
		margin-top: 1rem;
	}

	img {
		border-radius: 25px;
		max-width: 200px;
	}
</style>
