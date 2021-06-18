<script lang="ts">
	import Avatar from '$components/Avatar';

	let input: HTMLInputElement | null = null;
	export let src: string = '';

	const onKeyPress: svelte.JSX.KeyboardEventHandler<HTMLLabelElement> = () => {
		input?.click();
	};

	const onClear = () => {
		src = '';
	};
</script>

<label role="button" tabindex={0} for="avatar" on:keypress={onKeyPress}>
	<Avatar tabindex={-1} name="" {src} />
	<span>Upload your avatar (up to 2MB)</span>
	<input
		bind:this={input}
		hidden
		id="avatar"
		name="avatar"
		type="file"
		accept="image/*"
		placeholder="No file uploaded"
		on:change
	/>
	<div
		class="material-icons"
		role="button"
		tabindex={0}
		on:keypress|preventDefault|stopPropagation={onClear}
		on:click|preventDefault={onClear}
	>
		close
	</div>
</label>

<style>
	label {
		display: flex;
		align-items: center;
		cursor: pointer;
		border: 1px solid rgba(51, 51, 51, 0.5);
		border-radius: 25px;
		justify-content: flex-start;
	}

	span {
		margin-left: 10px;
	}

	div {
		margin-left: auto;
		margin-right: 10px;
		border-radius: 25px;
		padding: 5px;
		transition: background 0.3s;
	}

	div:hover {
		background: rgba(204, 204, 204, 1);
	}
</style>
