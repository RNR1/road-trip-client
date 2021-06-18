import type { AuthResponse } from './auth';

type Participant = Omit<AuthResponse, 'id'> & {
	_id: string;
};

declare interface Trip {
	_id: string;
	name: string;
	slug: string;
	description: string;
	image: { src: string; alt: string };
	participants: Participant[];
	invitees: Participant[];
}

declare type AddTripResponse = {
	message: string;
	id: string;
	slug: string;
};

export type { Trip, AddTripResponse, Participant };
