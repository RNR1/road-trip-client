<script lang="ts">
	import { ScheduledEvents } from '$api/methods';
	import { page } from '$app/stores';
	import Button from '$components/Button';
	import { FormControl, LocationAutocomplete, DateTimePicker } from '$components/forms';
	import Modal from '$components/Modal';
	import Notification from '$components/Notification/Notification.svelte';
	import { getISODate, getISOTime, toDateObject } from '$lib/format';
	import { isValidDateRange } from '$lib/validation';
	import type { Status } from '$typings/common';
	import type { ScheduledEvent } from '$typings/trips';
	import { createEventDispatcher } from 'svelte';

	export let open = false;
	export let selectedDay: Date | null = null;
	export let selectedEvent: ScheduledEvent | null = null;

	const dispatch = createEventDispatcher<{ invalidate: void }>();

	let title: string = selectedEvent?.title ?? 'New Event';
	let location: HTMLInputElement | null = null;
	let startDate = getISODate(selectedEvent ? new Date(selectedEvent.startDate) : selectedDay);
	let startTime = getISOTime(selectedEvent ? new Date(selectedEvent.startDate) : selectedDay);
	let endDate = getISODate(selectedEvent ? new Date(selectedEvent.endDate) : selectedDay);
	let endTime = getISOTime(selectedEvent ? new Date(selectedEvent.endDate) : selectedDay);
	$: locationValue = selectedEvent?.location ?? '';

	const initForm = () => {
		title = selectedEvent?.title ?? 'New Event';
		startDate = getISODate(selectedEvent ? new Date(selectedEvent.startDate) : selectedDay);
		startTime = getISOTime(selectedEvent ? new Date(selectedEvent.startDate) : selectedDay);
		endDate = getISODate(selectedEvent ? new Date(selectedEvent.endDate) : selectedDay);
		endTime = getISOTime(selectedEvent ? new Date(selectedEvent.endDate) : selectedDay);
	};

	$: if (open) initForm();

	let message: string | null = null;
	let severity: Status | null = null;
	let loading: boolean = false;
	let deleting: boolean = false;

	const onSubmit = async () => {
		try {
			loading = true;
			const start = toDateObject(startDate, startTime);
			const end = toDateObject(endDate, endTime);
			if (!isValidDateRange(start, end)) throw new Error('Please specify a valid date range');

			const event = {
				title,
				location: location.value,
				startDate: start.toISOString(),
				endDate: end.toISOString(),
				schedule: $page.query.get('scheduleId')
			};
			const response = await (selectedEvent
				? ScheduledEvents.edit(selectedEvent._id, event)
				: ScheduledEvents.add(event));
			message = response.message;
			severity = 'success';
			dispatch('invalidate');
		} catch (error) {
			message = error.message;
			severity = 'error';
		} finally {
			loading = false;
		}
	};

	const onDelete = async () => {
		try {
			deleting = true;
			const response = await ScheduledEvents.delete(selectedEvent._id);
			message = response.message;
			severity = 'success';
			dispatch('invalidate');
		} catch (error) {
			message = error.message;
			severity = 'error';
		} finally {
			deleting = false;
		}
	};
</script>

{#if open}
	<Modal title="Add event" on:backdrop-click on:close>
		<form on:submit|preventDefault={onSubmit}>
			<FormControl
				required
				name="title"
				label="Title"
				bind:value={title}
				placeholder="The name of your event"
			/>
			<LocationAutocomplete
				name="location"
				label="Location"
				bind:input={location}
				value={locationValue}
			/>
			<DateTimePicker
				name="startTime"
				label="Start Date"
				bind:dateValue={startDate}
				bind:timeValue={startTime}
			/>
			<DateTimePicker
				name="endDate"
				label="End Date"
				bind:dateValue={endDate}
				bind:timeValue={endTime}
			/>
			<button hidden />
		</form>
		<div slot="footer">
			<Button {loading} on:click={onSubmit}>{selectedEvent ? 'Save' : 'Add'}</Button>
			{#if selectedEvent}
				<Button loading={deleting} type="button" variant="outline" on:click={onDelete}>
					Delete
				</Button>
			{/if}
		</div>
	</Modal>
{/if}
<Notification open={Boolean(message)} bind:message bind:severity />
