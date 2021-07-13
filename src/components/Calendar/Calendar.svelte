<script lang="ts">
	import calendarize from 'calendarize';
	import Arrow from './Arrow.svelte';

	export let offset: number = 0;
	export let today: Date = new Date();
	export let selectedDay: Date | null = null;
	let year: number = today.getFullYear();
	let month: number = today.getMonth();

	export let labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	export let months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'July',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	$: today_month = today && today.getMonth();
	$: today_year = today && today.getFullYear();
	$: today_day = today && today.getDate();

	$: selected_month = selectedDay && selectedDay.getMonth();
	$: selected_year = selectedDay && selectedDay.getFullYear();
	$: selected_day = selectedDay && selectedDay.getDate();
	$: isSelected = (day: number) => {
		return (
			selectedDay && selected_year === year && selected_month === month && selected_day === day
		);
	};

	let prev = calendarize(new Date(year, month - 1), offset);
	let current = calendarize(new Date(year, month), offset);
	let next = calendarize(new Date(year, month + 1), offset);

	function toPrev() {
		[current, next] = [prev, current];

		if (--month < 0) {
			month = 11;
			year--;
		}

		prev = calendarize(new Date(year, month - 1), offset);
	}

	function toNext() {
		[prev, current] = [current, next];

		if (++month > 11) {
			month = 0;
			year++;
		}

		next = calendarize(new Date(year, month + 1), offset);
	}

	function isToday(day: number) {
		return today && today_year === year && today_month === month && today_day === day;
	}

	function selectDay(current: number) {
		selectedDay = new Date(year, month, current);
	}
</script>

<header>
	<Arrow left on:click={toPrev} />
	<h4>{months[month]} {year}</h4>
	<Arrow on:click={toNext} />
</header>

<div class="month">
	{#each labels as txt, idx (txt)}
		<span class="label">{labels[(idx + offset) % 7]}</span>
	{/each}

	{#each { length: 6 } as w, idxw (idxw)}
		{#if current[idxw]}
			{#each { length: 7 } as d, idxd (idxd)}
				{#if current[idxw][idxd] != 0}
					<span
						role="button"
						on:click={() => selectDay(current[idxw][idxd])}
						class="date"
						class:today={isToday(current[idxw][idxd])}
						class:selected={isSelected(current[idxw][idxd])}
					>
						{current[idxw][idxd]}
					</span>
				{:else if idxw < 1}
					<span class="date other">{prev[prev.length - 1][idxd]}</span>
				{:else}
					<span class="date other">{next[0][idxd]}</span>
				{/if}
			{/each}
		{/if}
	{/each}
</div>

<style>
	header {
		display: flex;
		margin: 2rem auto;
		align-items: center;
		justify-content: center;
		user-select: none;
	}

	h4 {
		display: block;
		text-transform: uppercase;
		font-size: 140%;
		margin: 0 1rem;
	}

	.month {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-gap: 8px;
	}

	.label {
		font-weight: 300;
		text-align: center;
		text-transform: uppercase;
		margin-bottom: 0.5rem;
		opacity: 0.6;
	}

	.date {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 50px;
		font-size: 1rem;
		letter-spacing: -1px;
		border: 1px solid #e6e4e4;
		padding-right: 4px;
		font-weight: 700;
		padding: 0.5rem;
		border-radius: 50%;
		transition: all 0.3s;
	}

	.date:not(.other) {
		cursor: pointer;
	}

	.date:not(.other):hover {
		background: rgba(204, 204, 204, 0.3);
	}

	@media (max-width: 500px) {
		.date {
			height: 30px;
			width: 30px;
			font-size: 0.875rem;
		}
	}

	.date.today {
		color: #5286fa;
		background: #c4d9fd;
		border-color: currentColor;
	}

	.date.other {
		opacity: 0.2;
	}

	.date.selected {
		color: orange;
	}
</style>
