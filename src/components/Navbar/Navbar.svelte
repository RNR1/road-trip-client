<script>
	import Backdrop from '../Backdrop/Backdrop.svelte';
</script>

<Backdrop on:click transparent />
<div id="modal">
	<nav on:click>
		<a href="/login">
			<span class="material-icons">login</span>
			<span>Login</span>
		</a>
		<a href="/signup">
			<span class="material-icons">login</span>
			Sign up</a
		>
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
	}

	nav {
		display: block;
		width: 100%;
		border-radius: inherit;
	}
	a {
		color: inherit;
		display: flex;
		padding: 0.5rem 2rem;
		align-items: center;
		height: 100%;
		width: 100%;
		border-radius: inherit;
	}

	a:hover,
	a:active {
		text-decoration: none;
		background: #ccc;
	}

	.material-icons {
		margin-right: 5px;
	}
</style>
