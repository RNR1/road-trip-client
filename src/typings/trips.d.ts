import type { BasicResponse } from './api';
import type { AuthResponse } from './auth';
import type { Note } from './notes';

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
	notes: Note[];
}

declare type AddTripResponse = BasicResponse & {
	id: string;
	slug: string;
};

export type { Trip, AddTripResponse, Participant };
