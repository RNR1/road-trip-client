<script lang="ts">
	import type { Reservation } from '$app/typings/reservations';
	import Card from '$components/Card';

	export let reservation: Reservation;
</script>

<li>
	<Card>
		<a href={reservation.url} rel="external noopener noreferrer" target="_blank">
			<p>{reservation.description}</p>
			<h3>{reservation.title}</h3>
			<p>{reservation.properties.join(' • ')}</p>
			<p>{reservation.services.join(' • ')}</p>
			<p>${reservation.price} / night</p>
			<img src={reservation.image} alt={reservation.description} />
		</a>
	</Card>
</li>

<style>
	li {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	img {
		width: 100%;
		max-width: 500px;
		border-radius: 25px;
	}

	a {
		color: inherit;
		text-decoration: none;
	}
</style>
