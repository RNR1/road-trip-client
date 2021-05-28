import type { BasicResponse } from '$typings/api';
import type { Meetup } from '$typings/meetups';

export function getMeetupsResponse(meetups: Record<string, Omit<Meetup, 'id'>>): Meetup[] {
	return Object.entries(meetups).map(([id, meetup]) => ({
		id,
		...meetup
	}));
}

export function addMeetupResponse({ name }: BasicResponse): string {
	return name;
}
