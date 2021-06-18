import client from '$api/client';
import type { ReservationSearchOptions, ReservationResponse } from '$typings/reservations';
import type { AuthResponse, LoginPayload, SignupPayload } from '$typings/auth';
import type { AddTripResponse, Participant, Trip } from '$typings/trips';
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
		client.get<ReservationResponse>({
			context,
			endpoint: '/reservations/search',
			params,
			headers: authHeader()
		})
};

export const Trips = {
	list: (context: { fetch: typeof fetch }) =>
		client.get<Trip[]>({ context, endpoint: '/trips', headers: authHeader() }),
	trip: (context: { fetch: typeof fetch }, slug: string) =>
		client.get<Trip>({ context, endpoint: `/trips/${slug}`, headers: authHeader() }),
	add: (body: Pick<Trip, 'name' | 'image' | 'description'>) =>
		client.post<typeof body, AddTripResponse>({
			endpoint: '/trips',
			body,
			headers: authHeader()
		}),
	invitations: (context: { fetch: typeof fetch }) =>
		client.get<Trip[]>({ context, endpoint: '/trips/invites', headers: authHeader() }),
	invite: (body: { email: string; tripId: string }) =>
		client.post<typeof body, { message: string }>({
			endpoint: '/trips/invites',
			body,
			headers: authHeader()
		}),
	updateInvitation: (tripId: string, body: { action: 'join' | 'decline' }) =>
		client.put<typeof body, { message: string }>({
			endpoint: `/trips/invites/${tripId}`,
			body,
			headers: authHeader()
		})
};
