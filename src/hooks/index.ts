import type { GetSession } from '@sveltejs/kit/types/hooks';

export const getSession: GetSession = (request) => {
	return {
		user: {
			// only include properties needed client-side —
			// exclude anything else attached to the user
			// like access tokens etc
			name: request.locals.user?.name,
			email: request.locals.user?.email,
			avatar: request.locals.user?.avatar
		}
	};
};
