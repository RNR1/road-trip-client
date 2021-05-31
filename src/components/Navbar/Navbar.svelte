<script>
	import Backdrop from '../Backdrop/Backdrop.svelte';
</script>

<Backdrop on:click transparent />
<div id="modal">
	<nav on:click>
		<a href="/login">
			<span class="material-icons">login</span>
			<span class="label">Login</span>
		</a>
		<a href="/signup">
			<span class="material-icons">login</span>
			<span class="label">Sign up</span>
		</a>
	</nav>
</div>

<style>
	#modal {
		position: absolute;
		background-color: white;
		border-radius: 8px;
		right: 10px;
		top: 55px;
		z-index: 100;
		min-width: max-content;
	}

	nav {
		display: block;
		width: 100%;
		border-radius: inherit;
	}
	a {
		color: inherit;
		display: flex;
		padding: 1rem 0.5rem;
		align-items: center;
		justify-content: space-around;
		height: 100%;
		width: 100%;
		border-radius: inherit;
	}

	a:hover,
	a:active {
		text-decoration: none;
		background: #ccc;
	}

	.label {
		width: 100%;
		padding: 0 2rem;
	}

	.material-icons {
		margin-right: 10px;
	}
</style>
