import { browser } from '$app/env';
import type { AuthResponse } from '$app/typings/auth';
import authState from '$data/auth';
import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';

let auth = {};
authState.subscribe((session) => (auth = session));

export async function authGuard({ page }: LoadInput): Promise<LoadOutput> {
	if (!browser) return { status: 200 };
	await authState.verify({ fetch });
	const loggedIn = Boolean((auth as AuthResponse)?.token);

	if (loggedIn && page.path === '/login') return { status: 302, redirect: '/' };
	else if (loggedIn || page.path === '/login' || page.path === '/') return {};
	else return { status: 302, redirect: '/login' };
}
