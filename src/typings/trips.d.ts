import type { AuthResponse } from './auth';

declare interface Trip {
	_id: string;
	name: string;
	slug: string;
	description: string;
	image: { src: string; alt: string };
	participants: AuthResponse[];
}

declare type AddTripResponse = {
	message: string;
	id: string;
	slug: string;
};

export type { Trip, AddTripResponse };
