<script lang="ts">
	import { goto } from '$app/navigation';
	import { Auth } from '$api/methods';
	import { FormControl } from '$components/forms';
	import Button from '$components/Button';
	import Card from '$components/Card';
	import Notification from '$components/Notification';
	import { configKey } from '$config/constants';
	import { isEmpty, isValidEmail } from '$utils/validation';

	let email = '';
	let password = '';

	let loading = false;
	let error = '';

	$: isEmailValid = !isEmpty(email) && isValidEmail(email);
	$: isPasswordValid = !isEmpty(password) && password?.length > 5;
	$: isFormValid = isEmailValid && isPasswordValid;

	const onSubmit: svelte.JSX.FormEventHandler<HTMLFormElement> = (e) => {
		error = '';
		loading = true;
		Auth.login({ email, password })
			.then(({ message, ...config }) => {
				loading = false;
				localStorage.setItem(configKey, JSON.stringify(config));
				goto('/');
			})
			.catch((err: { message: string }) => {
				loading = false;
				error = err.message;
			});
	};
</script>

<svelte:head>
	<title>Road Trip • Sign up</title>
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
<Notification open={Boolean(error)} bind:message={error} severity="error" />

<style>
	form {
		width: 100%;
	}
</style>
