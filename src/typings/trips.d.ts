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
	schedule: TripSchedule;
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
	maxHoursPerDay?: number;
};

declare type ScheduledEvent = {
	_id?: string;
	title: string;
	location: string;
	startDate: string;
	endDate: string;
	schedule?: TripSchedule | string;
};

declare type TripSchedule = {
	_id: string;
	events: ScheduledEvent[];
	trip: Trip | string;
};

export type {
	AddTripResponse,
	Participant,
	ScheduledEvent,
	Trip,
	TripPlan,
	TripSchedule,
	Waypoint
};
