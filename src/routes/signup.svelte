<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { FormControl, AvatarInput } from '$components/forms';
	import Button from '$components/Button/Button.svelte';
	import Card from '$components/Card';
	import Notification from '$components/Notification';
	import { APP_NAME, IMAGE_SIZE_LIMIT } from '$config/constants';
	import auth from '$data/auth';
	import type { Status } from '$typings/common';
	import { isEmpty, isValidEmail } from '$utils/validation';
	import { readFile } from '$utils/string';

	let avatar: string = '';
	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';
	let key = $page.query.get('key');
	let loading = false;
	let message = '';
	let severity: Status | null = null;

	$: isFirstNameValid = !isEmpty(firstName);
	$: isLastNameValid = !isEmpty(lastName);
	$: isEmailValid = !isEmpty(email) && isValidEmail(email);
	$: isPasswordValid = !isEmpty(password) && password?.length > 5;
	$: isFormValid = isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid;

	const onSubmit: svelte.JSX.FormEventHandler<HTMLFormElement> = (e) => {
		message = '';
		severity = null;
		loading = true;
		const body = {
			firstName,
			lastName,
			email,
			password,
			key,
			avatar: !isEmpty(avatar) ? avatar : undefined
		};
		auth
			.signup(body)
			.then(({ message: msg }) => {
				loading = false;
				message = msg;
				severity = 'success';
				goto('/');
			})
			.catch((res: { message: string }) => {
				loading = false;
				message = res.message;
				severity = 'error';
			});
	};

	const onSelectFile: svelte.JSX.FormEventHandler<HTMLInputElement> = async (e) => {
		const { files } = e.currentTarget;
		if (!files.length) return;
		if (files[0]?.size > IMAGE_SIZE_LIMIT) {
			message = 'This file is not supported, please upload a smaller file(up to 2MB).';
			severity = 'error';
			return;
		}

		const { data } = await readFile(files[0]);
		avatar = data as string;
	};
</script>

<svelte:head>
	<title>{APP_NAME} • Sign up</title>
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
<Notification open={Boolean(message)} bind:message bind:severity />

<style>
	form {
		width: 100%;
	}
</style>
