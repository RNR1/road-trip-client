import client from '$api/client';
import type { ReservationSearchOptions, Reservation } from '$typings/reservations';
import { configKey } from '$config/constants';
import type { AuthResponse, LoginPayload, SignupPayload } from '$typings/auth';
import { authHeader } from './constants';

export const Auth = {
	login: (body: LoginPayload) =>
		client.post<LoginPayload, AuthResponse>({
			endpoint: '/auth/login',
			body
		}),
	signup: (body: SignupPayload) =>
		client.post<SignupPayload, AuthResponse>({ endpoint: '/auth/signup', body }),
	verifyUser: (context: { fetch: typeof fetch }) =>
		client.get<AuthResponse>({
			context,
			endpoint: '/auth/verify',
			headers: authHeader()
		})
};

export const Reservations = {
	search: (context: { fetch: typeof fetch }, params: ReservationSearchOptions) =>
		client.get<{ message: string; results: Reservation[] }>({
			context,
			endpoint: '/reservations/search',
			params,
			headers: authHeader()
		})
};
