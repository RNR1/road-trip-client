<script lang="ts">
	import Calendar from '$components/Calendar';
	import { APP_NAME } from '$config/constants';

	let today: Date = new Date();
	let selectedDay: Date = today;
</script>

<svelte:head>
	<title>{APP_NAME} • Trip schedule</title>
</svelte:head>
<section class="container">
	<section class="calendar">
		<Calendar bind:today bind:selectedDay />
	</section>
	<section class="day-schedule">
		<h3>{selectedDay.toDateString()}</h3>
		<p>No scheduled events for this day</p>
	</section>
</section>

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
		box-shadow: 0px 10px 17.869px rgba(0, 0, 0, 0.0417275), 0px -3px 10.0172px rgba(0, 0, 0, 0.035),
			0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725),
			0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802);
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
	}
</style>
