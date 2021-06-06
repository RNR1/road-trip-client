<script lang="ts">
	import ErrorMessage from '$components/forms/ErrorMessage.svelte';

	export let label: string;
	export let name: string;
	export let value: string;
	export let placeholder: string = '';
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
	<input
		class:invalid={!valid && touched}
		bind:value
		{name}
		{placeholder}
		type="date"
		on:blur={setTouched}
	/>
	<ErrorMessage>
		{#if errorMessage && !valid && touched}
			{errorMessage}
		{/if}
	</ErrorMessage>
</div>

<style>
	input {
		display: block;
		width: 100%;
		font: inherit;
		border: none;
		border-bottom: 2px solid #ccc;
		border-radius: 10px;
		background: white;
		padding: 0.3rem 0.25rem;
		transition: border-color 0.1s ease-out;
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

	.invalid {
		border-color: red;
		background: #fde3e3;
	}

	sup {
		color: red;
	}
</style>
