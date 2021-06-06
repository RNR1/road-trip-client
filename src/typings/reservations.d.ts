export type ReservationSearchOptions = {
	location: string;
	in: string;
	out: string;
	for: string;
};

export interface Reservation {
	title: string;
	url: string;
	image: string;
	description: string;
	properties: string[];
	services: string[];
	price: string | number;
}
