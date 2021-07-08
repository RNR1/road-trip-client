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
	plan: TripPlan;
}

declare type AddTripResponse = BasicResponse & {
	id: string;
	slug: string;
};

declare type Waypoint = {
	_id: string;
	input?: HTMLInputElement | null;
	location: string;
	stopover: boolean;
};

declare type TripPlan = {
	_id?: string;
	origin: string;
	waypoints: Waypoint[];
	destination: string;
};

export type { Trip, AddTripResponse, Participant, Waypoint, TripPlan };
