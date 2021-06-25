<script lang="ts">
	import { goto } from '$app/navigation';
	import { FormControl } from '$components/forms';
	import Button from '$components/Button';
	import Card from '$components/Card';
	import Notification from '$components/Notification';
	import { APP_NAME } from '$config/constants';
	import auth from '$data/auth';
	import type { Status } from '$typings/common';
	import type { BasicResponse } from '$typings/api';
	import { isEmpty, isValidEmail } from '$utils/validation';

	let email = '';
	let password = '';

	let loading = false;
	let message = '';
	let severity: Status | null = null;

	$: isEmailValid = !isEmpty(email) && isValidEmail(email);
	$: isPasswordValid = !isEmpty(password) && password?.length > 5;
	$: isFormValid = isEmailValid && isPasswordValid;

	const onSubmit: svelte.JSX.FormEventHandler<HTMLFormElement> = (e) => {
		message = '';
		loading = true;
		auth
			.login({ email, password })
			.then(({ message }) => {
				loading = false;
				message = message;
				severity = 'success';
				goto('/');
			})
			.catch((err: BasicResponse) => {
				loading = false;
				message = err.message;
				severity = 'error';
			});
	};
</script>

<svelte:head>
	<title>{APP_NAME} • Sign up</title>
</svelte:head>
<Card>
	<form on:submit|preventDefault={onSubmit}>
		<h2>Login</h2>
		<FormControl
			valid={isEmailValid}
			label="Email"
			type="email"
			name="email"
			placeholder="someone@example.com"
			bind:value={email}
			errorMessage="Wait! Looks like you didn't enter a valid email address. We need that to get going."
			required
		/>
		<FormControl
			valid={isPasswordValid}
			label="Password"
			type="password"
			name="password"
			placeholder="Minimum 5 characters"
			bind:value={password}
			errorMessage="We can't get on the road until you enter your password!"
			required
		/>
		<Button {loading} disabled={!isFormValid} type="submit">Login</Button>
	</form>
</Card>
<Notification open={Boolean(message)} bind:message bind:severity />

<style>
	form {
		width: 100%;
	}
</style>
