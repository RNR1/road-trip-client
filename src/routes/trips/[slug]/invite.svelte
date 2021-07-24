<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { Trips } from '$api/methods';
	import { browser } from '$app/env';
	import type { Trip } from '$typings/trips';
	import { APP_NAME } from '$config/constants';

	export const load: Load = async ({ page, fetch }) => {
		try {
			const trip: Trip = browser ? await Trips.trip({ fetch }, page.params.slug) : undefined;
			if (!trip) throw { message: 'Trip not found' };
			return { status: 200, props: { trip } };
		} catch (err) {
			return { status: 302, redirect: '/404' };
		}
	};
</script>

<script lang="ts">
	import Button from '$components/Button';
	import Card from '$components/Card';
	import { FormControl } from '$components/forms';
	import Notification from '$components/Notification';
	import auth from '$data/auth';
	import { isEmpty, isValidEmail } from '$lib/validation';
	import type { AuthResponse } from '$typings/auth';
	import type { Status } from '$typings/common';
	import { goto } from '$app/navigation';

	export let trip: Trip | null = null;
	let email = '';
	let loading: boolean = false;
	let message: string = '';
	let severity: Status | null = null;

	$: isEmailValid =
		!isEmpty(email) && isValidEmail(email) && email !== ($auth as AuthResponse)?.email;
	$: errorMessage =
		email === ($auth as AuthResponse)?.email
			? "You can't invite yourself"
			: "Wait! Looks like you didn't enter a valid email address. We need that to get going.";

	const onSubmit = async () => {
		try {
			loading = true;
			const { _id: tripId, slug } = trip;
			const { message: msg } = await Trips.invite({ email, tripId });
			message = msg;
			severity = 'success';
			loading = false;
			await goto(`/trips/${slug}`);
		} catch (error) {
			loading = false;
			message = error;
			severity = 'error';
		}
	};
</script>

<svelte:head>
	<title>{APP_NAME} • Invite a friend to {trip?.name}</title>
</svelte:head>
<Card>
	<form on:submit|preventDefault={onSubmit}>
		<h2>Invite a friend</h2>
		<p>We need an email of your friend to send him an invitation to your trip</p>
		<FormControl
			valid={isEmailValid}
			label="Email"
			type="email"
			name="email"
			placeholder="someone@example.com"
			bind:value={email}
			{errorMessage}
			required
		/>
		<Button {loading} disabled={!isEmailValid} type="submit">Invite friend</Button>
	</form>
</Card>
<Notification {message} {severity} />
