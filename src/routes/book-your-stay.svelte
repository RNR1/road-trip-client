<script lang="ts">
	import { Reservations } from '$api/methods';
	import { FormControl, DatePicker } from '$components/forms';
	import Card from '$components/Card/Card.svelte';
	import Button from '$components/Button/Button.svelte';
	import Notification from '$components/Notification';
	import ReservationCard from '$components/ReservationCard';
	import type { Reservation } from '$typings/reservations';
	import type { Status } from '$typings/common';
	import { isEmpty } from '$lib/validation';
	import { APP_NAME } from '$config/constants';

	let location: string = '';
	let checkIn: string = '';
	let checkOut: string = '';
	let guests: string = '';
	let reservations: Reservation[] = [];
	let loading = false;
	let message = '';
	let severity: Status;

	$: isLocationValid = !isEmpty(location);
	$: isCheckInValid = !isEmpty(checkIn);
	$: isCheckOutValid = !isEmpty(checkOut);
	$: isGuestsValid = !isEmpty(guests);
	$: isFormValid = isLocationValid && isCheckInValid && isCheckOutValid && isGuestsValid;

	const onSubmit = async () => {
		loading = true;
		severity = 'info';
		message = 'Fetching data from Airbnb, this might take a few seconds.';
		try {
			const { results, message: notification } = await Reservations.search(
				{ fetch },
				{ location, in: checkIn, out: checkOut, for: guests }
			);
			loading = false;
			message = notification;
			severity = 'success';
			reservations = [...results];
		} catch (err) {
			loading = false;
			message = err.message;
			severity = 'error';
		}
	};
</script>

<svelte:head>
	<title>{APP_NAME} • Book your stay</title>
</svelte:head>
<Card>
	<form on:submit|preventDefault={onSubmit}>
		<h2>Book your stay</h2>
		<div>
			<FormControl
				label="Location"
				type="text"
				name="location"
				bind:value={location}
				placeholder="Location"
			/>
			<DatePicker label="Check in" name="in" bind:value={checkIn} placeholder="Check in" />
			<DatePicker label="Check out" name="out" bind:value={checkOut} placeholder="Check out" />
			<FormControl
				label="Adult Guests"
				type="number"
				name="for"
				bind:value={guests}
				placeholder="Guests"
			/>
			<Button disabled={!isFormValid || loading} type="submit" {loading}>Submit</Button>
		</div>
	</form>
</Card>
<ul>
	{#each reservations as reservation (reservation.title)}
		<ReservationCard {reservation} />
	{/each}
</ul>
<Notification open={Boolean(message)} bind:message bind:severity />

<style>
	form {
		padding: 0 3rem;
	}

	form div {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-wrap: wrap;
	}

	ul {
		margin: 0;
		padding: 0;
	}
</style>
