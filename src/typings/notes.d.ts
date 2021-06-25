import type { Trip } from './trips';

declare type Note = {
	_id: string;
	title: string;
	content: string;
	createdBy: User;
	createdAt: string;
	updatedAt: string;
	trip: Trip;
};

declare type NotePayload = Pick<Note, 'title' | 'content'> & {
	_id?: string;
	trip?: string;
};

export type { Note, NotePayload };
