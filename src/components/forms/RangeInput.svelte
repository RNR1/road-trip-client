<script lang="ts">
	import ErrorMessage from '$components/forms/ErrorMessage.svelte';

	export let label: string;
	export let name: string;
	export let value: number = 5;
	export let max: number = 0;
	export let min: number = 0;
	export let valid: boolean = true;
	export let errorMessage = '';
	export let required = false;
	let touched: boolean = false;

	function setTouched() {
		touched = true;
	}
</script>

<div class="form-control">
	<label for={name}>
		{label}
		{#if required}
			<sup>*</sup>
		{/if}
	</label>
	<div class="input-container">
		<input
			class:invalid={!valid && touched}
			type="range"
			bind:value
			{name}
			{max}
			{min}
			on:blur={setTouched}
		/>
		<input class="counter" readonly {value} />
	</div>
	<ErrorMessage>
		{#if errorMessage && !valid && touched}
			{errorMessage}
		{/if}
	</ErrorMessage>
</div>

<style>
	input {
		width: 80%;
		font: inherit;
		border: none;
		border-bottom: 2px solid #ccc;
		border-radius: 10px;
		background: white;
		padding: 0.5rem 0.25rem;
		transition: border-color 0.1s ease-out;
	}

	.counter {
		margin-left: 0.5rem;
		width: 10%;
	}

	input:focus {
		border-color: #e40763;
		outline: none;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		width: 100%;
	}

	.form-control {
		margin: 0.5rem 0.25rem;
		width: 100%;
	}

	.input-container {
		display: flex;
		align-items: center;
	}

	.invalid {
		border-color: red;
		background: #fde3e3;
	}

	sup {
		color: red;
	}
</style>
