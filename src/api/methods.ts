import client from '$api/client';
import { authHeader } from '$api/constants';
import type { ReservationSearchOptions, ReservationResponse } from '$typings/reservations';
import type { AuthResponse, LoginPayload, SignupPayload } from '$typings/auth';
import type { AddTripResponse, Trip } from '$typings/trips';
import type { BasicResponse } from '$typings/api';
import type { Note, NotePayload } from '$typings/notes';

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
	edit: (slug: string, body: Pick<Trip, 'name' | 'image' | 'description'>) =>
		client.patch<typeof body, BasicResponse>({
			endpoint: `/trips/${slug}`,
			body,
			headers: authHeader()
		}),
	delete: (id: string) =>
		client.delete<BasicResponse>({ endpoint: `/trips/${id}`, headers: authHeader() }),
	invitations: (context: { fetch: typeof fetch }) =>
		client.get<Trip[]>({ context, endpoint: '/trips/invites', headers: authHeader() }),
	invite: (body: { email: string; tripId: string }) =>
		client.post<typeof body, BasicResponse>({
			endpoint: '/trips/invites',
			body,
			headers: authHeader()
		}),
	updateInvitation: (tripId: string, body: { action: 'join' | 'decline' }) =>
		client.put<typeof body, BasicResponse>({
			endpoint: `/trips/invites/${tripId}`,
			body,
			headers: authHeader()
		})
};

export const Notes = {
	list: (params: { trip: string }) =>
		client.get<Note[]>({ endpoint: '/notes', params, headers: authHeader() }),
	add: (body: NotePayload) =>
		client.post<typeof body, BasicResponse>({ endpoint: '/notes', body, headers: authHeader() }),
	edit: (id: string, body: NotePayload) =>
		client.patch<typeof body, BasicResponse>({
			endpoint: `/notes/${id}`,
			body,
			headers: authHeader()
		}),
	remove: (id: string) =>
		client.delete<BasicResponse>({ endpoint: `/notes/${id}`, headers: authHeader() })
};
