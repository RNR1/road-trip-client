import { writable } from 'svelte/store';
import { Auth } from '$api/methods';
import { configKey } from '$config/constants';
import type { AuthResponse, LoginPayload } from '$typings/auth';

function createSession() {
	const session = writable<AuthResponse | object>({});

	return {
		subscribe: session.subscribe,
		set: session.set,
		update: session.update,
		login: (body: LoginPayload) =>
			Auth.login(body).then((payload) => {
				const { message, ...user } = payload;
				session.set(user);
				localStorage.setItem(configKey, user.token);
				return payload;
			}),
		clear: () => {
			localStorage.clear();
			session.set({});
		},
		verify: (context: { fetch: typeof fetch }) =>
			Auth.verifyUser(context)
				.then((response) => {
					session.set({ ...response, token: localStorage.getItem(configKey) });
					return response;
				})
				.catch(() => {
					session.set({});
				})
	};
}

export default createSession();
