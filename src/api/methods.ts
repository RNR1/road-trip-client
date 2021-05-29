import client from '$api/client';
import type { LoginPayload } from '$typings/auth';

export const Auth = {
	login: (body: LoginPayload) => client.post({ endpoint: '/auth/login', body }),
	signup: () => {}
};
