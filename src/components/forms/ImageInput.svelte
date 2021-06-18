<script lang="ts">
	export let src: string = '';
	export let alt: string = '';
	let input: HTMLInputElement | null = null;

	const onKeyPress: svelte.JSX.KeyboardEventHandler<HTMLLabelElement> = () => {
		input?.click();
	};

	const onClear = () => {
		src = '';
		alt = '';
	};
</script>

<label role="button" tabindex={0} for="image" on:keypress={onKeyPress}>
	{#if src}
		<img {src} {alt} />
	{:else}
		<div class="placeholder">
			<span class="material-icons image-icon">image</span>
		</div>
	{/if}
	<span class="description">Upload your image (up to 2MB)</span>
	<input bind:this={input} hidden id="image" name="image" type="file" accept="image/*" on:change />
	<div
		class="material-icons"
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
		height: 100%;
	}

	img,
	.placeholder {
		min-width: 100px;
		min-height: 100px;
		max-width: 100px;
		max-height: 100px;
		border-radius: 25px;
	}

	.placeholder {
		border: 1px dashed #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.description {
		margin-left: 10px;
	}

	.image-icon {
		font-size: 3rem;
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
