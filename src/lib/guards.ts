import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';
import { browser } from '$app/env';
import { goto } from '$app/navigation';
import { authRoutes, publicRoutes } from '$config/constants';
import type { AuthResponse } from '$typings/auth';
import authState from '$data/auth';

let auth: AuthResponse;
authState.subscribe((session) => (auth = session as AuthResponse));

export async function authGuard({ page }: LoadInput): Promise<LoadOutput> {
	if (!browser) return { status: 200, props: { loading: true } };
	const isExactMatch = (path: string) => page.path === path;
	const isAuthRoute = authRoutes.some(isExactMatch);
	const isPublicRoute = publicRoutes.some(isExactMatch);
	const isProtectedRoute = !isAuthRoute && !isPublicRoute;

	try {
		if (!auth?.token) await authState.verify({ fetch });
		const loggedIn = Boolean((auth as AuthResponse)?.token);
		if (!loggedIn) throw new Error('Unauthenticated');
		if (isAuthRoute) return await goto('/');
	} catch (err) {
		if (isProtectedRoute) return await goto('/login');
	} finally {
		return { status: 200 };
	}
}
