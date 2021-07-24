<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { TripSchedules } from '$api/methods';
	import { browser } from '$app/env';

	export const load: Load = async ({ page, fetch }) => {
		try {
			const schedule: TripSchedule = browser
				? await TripSchedules.schedule({ fetch }, page.query.get('scheduleId'))
				: undefined;
			return { status: 200, props: { schedule } };
		} catch (err) {
			return { status: 302, redirect: '/404' };
		}
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import Calendar from '$components/Calendar';
	import { APP_NAME } from '$config/constants';
	import type { ScheduledEvent, TripSchedule } from '$typings/trips';
	import AddEventModal from './_AddEventModal.svelte';
	import { toTimeRangeString, toTimeString } from '$lib/format';

	export let schedule: TripSchedule | null = null;
	let today: Date = new Date();
	let selectedDay: Date = today;
	let isAddEventVisible: boolean = false;
	let selectedEvent: ScheduledEvent | null = null;

	$: if (isAddEventVisible) selectedDay = new Date(selectedDay);

	const toggleAddEvent = () => {
		isAddEventVisible = !isAddEventVisible;
		if (!isAddEventVisible && selectedEvent) selectedEvent = null;
	};

	const showEvent = (event: ScheduledEvent) => {
		selectedEvent = event;
		toggleAddEvent();
	};

	const onInvalidate = async () => {
		isAddEventVisible = false;
		schedule = await TripSchedules.schedule({ fetch }, $page.query.get('scheduleId'));
	};

	$: selectedDayEvents = schedule?.events
		.filter(
			(event) =>
				new Date(event.startDate).toDateString() === selectedDay.toDateString() ||
				new Date(event.endDate).toDateString() === selectedDay.toDateString() ||
				(selectedDay >= new Date(event.startDate) && new Date(event.endDate) >= selectedDay)
		)
		.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
</script>

<svelte:head>
	<title>{APP_NAME} • Trip schedule</title>
</svelte:head>
<section class="container">
	<section class="calendar">
		<Calendar bind:today bind:selectedDay bind:schedule />
	</section>
	<section class="day-schedule">
		<div class="title-stack">
			<h3>{selectedDay.toDateString()}</h3>
			<button class="material-icons" on:click={toggleAddEvent}> add </button>
		</div>
		<ul>
			{#each selectedDayEvents as event (event._id)}
				<li class="event-item" on:click={() => showEvent(event)}>
					<div class="event-item-description">
						<span>{event.title}</span>
						<span class="location">{event.location}</span>
					</div>
					<time>{toTimeRangeString(event.startDate, event.endDate)}</time>
				</li>
			{:else}
				<li>No scheduled events for this day</li>
			{/each}
		</ul>
	</section>
</section>

<AddEventModal
	bind:open={isAddEventVisible}
	bind:selectedDay
	bind:selectedEvent
	on:backdrop-click={toggleAddEvent}
	on:close={toggleAddEvent}
	on:invalidate={onInvalidate}
/>

<style>
	.container {
		display: flex;
		justify-content: space-evenly;
		align-items: flex-start;
		width: 100vw;
		height: 60vh;
	}

	.calendar {
		flex: 0.9;
		padding: 1rem 3rem;
		height: 100%;
	}
	.day-schedule {
		border: #e6e4e4;
		margin: 2rem 1rem;
		flex: 1;
		height: 100%;
		padding: 1rem;
		overflow: auto;
		min-width: 300px;
		box-shadow: 0px 10px 17.869px rgba(0, 0, 0, 0.0417275), 0px -3px 10.0172px rgba(0, 0, 0, 0.035),
			0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725),
			0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802);
	}
	button {
		border-radius: 50%;
		height: 35px;
		width: 35px;
		border: none;
		box-shadow: 0px 10px 17.869px rgba(0, 0, 0, 0.0417275), 0px -3px 10.0172px rgba(0, 0, 0, 0.035),
			0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725),
			0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802);
		background: rgb(238, 238, 238, 0.6);
		transition: 0.3s all;
		cursor: pointer;
	}

	button:hover {
		background: rgb(238, 238, 238);
	}

	.title-stack {
		display: flex;
		justify-content: space-between;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li.event-item {
		padding: 0.5rem;
		margin: 0.5rem 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #eeeeee48;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s;
	}
	li.event-item:hover {
		background: #eeeeee;
	}
	li.event-item time {
		font-size: 0.75rem;
		opacity: 0.8;
	}
	li.event-item .event-item-description {
		display: flex;
		flex-direction: column;
	}

	li.event-item .location {
		margin-top: 0.3rem;
		font-size: 0.75rem;
		opacity: 0.6;
	}
	@media (max-width: 800px) {
		.container {
			flex-direction: column;
			align-items: center;
			height: 100%;
		}

		.day-schedule {
			margin: 1rem 0;
		}

		li.event-item {
			flex-direction: column;
			align-items: flex-start;
		}
		li.event-item time {
			margin-top: 0.5rem;
		}
	}
	@media (min-width: 550px) and (max-width: 800px) {
		.day-schedule {
			min-width: 500px;
		}
	}
</style>
