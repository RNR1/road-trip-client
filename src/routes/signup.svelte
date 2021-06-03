<script lang="ts">
	import { Auth } from '$api/methods';
	import { FormControl, AvatarInput } from '$components/forms';
	import Button from '$components/Button/Button.svelte';
	import Card from '$components/Card';
	import Notification from '$components/Notification';
	import { isEmpty, isValidEmail } from '$utils/validation';
	import { goto } from '$app/navigation';
	import { configKey } from '$config/constants';
	import { readFile } from '$utils/string';

	const SIZE_LIMIT = 1048576 * 2;

	let avatar: string = '';
	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';

	let loading = false;
	let error = '';

	$: isFirstNameValid = !isEmpty(firstName);
	$: isLastNameValid = !isEmpty(lastName);
	$: isEmailValid = !isEmpty(email) && isValidEmail(email);
	$: isPasswordValid = !isEmpty(password) && password?.length > 5;
	$: isFormValid = isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid;

	const onSubmit: svelte.JSX.FormEventHandler<HTMLFormElement> = (e) => {
		error = '';
		loading = true;
		const body = {
			firstName,
			lastName,
			email,
			password,
			avatar: !isEmpty(avatar) ? avatar : undefined
		};
		Auth.signup(body)
			.then(({ message, ...config }) => {
				loading = false;
				localStorage.setItem(configKey, JSON.stringify(config));
				goto('/');
			})
			.catch((res: { message: string }) => {
				loading = false;
				error = res.message;
			});
	};

	const onSelectFile: svelte.JSX.FormEventHandler<HTMLInputElement> = async (e) => {
		const { files } = e.currentTarget;
		if (!files.length) return;
		if (files[0]?.size > SIZE_LIMIT) {
			error = 'This file is not supported, please upload a smaller file(up to 2MB).';
			return;
		}

		const { data } = await readFile(files[0]);
		avatar = data as string;
	};
</script>

<svelte:head>
	<title>Road Trip • Sign up</title>
</svelte:head>
<Card>
	<form on:submit|preventDefault={onSubmit}>
		<h2>Sign up</h2>
		<AvatarInput bind:src={avatar} on:change={onSelectFile} />
		<FormControl
			valid={isFirstNameValid}
			label="First name"
			name="firstName"
			bind:value={firstName}
			errorMessage="Enter at least one character, but preferably more :)"
			required
		/>
		<FormControl
			valid={isLastNameValid}
			label="Last name"
			name="lastName"
			bind:value={lastName}
			errorMessage="Enter at least one character, but preferably more :)"
			required
		/>
		<FormControl
			valid={isEmailValid}
			label="Email"
			name="email"
			type="email"
			bind:value={email}
			placeholder="someone@example.com"
			errorMessage="Give us your real email, you'll need to use it to log in"
			required
		/>
		<FormControl
			valid={isPasswordValid}
			label="Password"
			name="password"
			type="password"
			bind:value={password}
			placeholder="Minimum 5 characters"
			errorMessage="Make it something you'll remember (but you can reset it if you forget)"
			required
		/>
		<Button {loading} disabled={!isFormValid} type="submit">Sign up</Button>
	</form>
</Card>
<Notification open={Boolean(error)} bind:message={error} severity="error" />

<style>
	form {
		width: 100%;
	}
</style>
