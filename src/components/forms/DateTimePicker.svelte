<script lang="ts">
	import ErrorMessage from '$components/forms/ErrorMessage.svelte';

	export let label: string;
	export let name: string;
	export let dateValue: string;
	export let timeValue: string;
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
	<div class="input-stack">
		<input
			class:invalid={!valid && touched}
			class="date"
			bind:value={dateValue}
			{name}
			type="date"
			on:blur={setTouched}
		/>
		<input
			class:invalid={!valid && touched}
			class="time"
			bind:value={timeValue}
			{name}
			type="time"
			on:blur={setTouched}
		/>
	</div>
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

	.input-stack {
		display: flex;
	}

	.date {
		flex: 1.2;
		margin-right: 0.5rem;
	}
	.time {
		flex: 0.8;
	}
</style>
