import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';
import { authRoutes, publicRoutes } from '$config/constants';
import { browser } from '$app/env';
import type { AuthResponse } from '$typings/auth';
import authState from '$data/auth';
import { goto } from '$app/navigation';

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
