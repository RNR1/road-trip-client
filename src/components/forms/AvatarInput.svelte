<script lang="ts">
	import Avatar from '$components/Avatar';

	export let src: string = '';

	const onClear: svelte.JSX.MouseEventHandler<HTMLDivElement> = () => {
		src = '';
	};
</script>

<label for="avatar">
	<Avatar name="" {src} />
	<span>Upload your avatar (up to 2MB)</span>
	<input hidden id="avatar" name="avatar" type="file" accept="image/*" on:change />
	<div class="material-icons" on:click|preventDefault={onClear}>close</div>
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
