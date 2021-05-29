import client from '$api/client';
import type { AuthResponse, LoginPayload, SignupPayload } from '$typings/auth';

export const Auth = {
	login: (body: LoginPayload) =>
		client.post<LoginPayload, AuthResponse>({
			endpoint: '/auth/login',
			body
		}),
	signup: (body: SignupPayload) =>
		client.post<SignupPayload, AuthResponse>({ endpoint: '/auth/signup', body })
};
