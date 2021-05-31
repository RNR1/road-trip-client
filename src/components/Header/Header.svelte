<script>
	import Avatar from '$components/Avatar';
	import Navbar from '$components/Navbar';

	let open = false;

	const onClick = () => {
		open = !open;
	};
</script>

<header>
	<h1><a href="/">Road Trip</a></h1>
	<div>
		<Avatar name="Ron Braha" on:click={onClick} />
		{#if open}
			<Navbar on:click={onClick} />
		{/if}
	</div>
</header>

<style>
	h1 a {
		color: inherit;
	}
	h1 a:hover {
		text-decoration: none;
	}
	header {
		display: flex;
		align-content: center;
		justify-content: space-between;
		position: fixed;
		left: 0;
		top: 0;
		padding: 0 2rem;
		width: 100%;
		text-align: center;
		background-color: #ce97b0;
	}

	div {
		position: relative;
		margin: auto 0;
	}
</style>
