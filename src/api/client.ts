import type { HTTPClientConfig } from '$typings/api';
import { baseURL, defaultHeaders } from './constants';

export async function get<T>({
	context,
	endpoint,
	headers = {},
	method = 'GET'
}: HTTPClientConfig<T>): Promise<T> {
	const ctxFetch = context?.fetch ?? fetch;
	return ctxFetch(`${baseURL}${endpoint}`, {
		headers: { ...defaultHeaders, ...headers },
		method
	})
		.then(handleError)
		.then((response) => response.json());
}

export async function post<T, R extends Record<string, unknown>>({
	endpoint,
	headers = {},
	body,
	method = 'POST'
}: HTTPClientConfig<T>): Promise<R> {
	return fetch(`${baseURL}${endpoint}`, {
		headers: { ...defaultHeaders, ...headers },
		body: JSON.stringify(body),
		method
	})
		.then(handleError)
		.then((response) => response.json());
}
export async function patch<T, R extends Record<string, unknown>>({
	endpoint,
	headers = {},
	body,
	method = 'PATCH'
}: HTTPClientConfig<T>): Promise<R> {
	return fetch(`${baseURL}${endpoint}`, {
		headers: { ...defaultHeaders, ...headers },
		body: JSON.stringify(body),
		method
	})
		.then(handleError)
		.then((response) => response.json())
		.catch((error) => console.error(error));
}
export async function remove<T>({
	endpoint,
	headers = {},
	body,
	method = 'DELETE'
}: HTTPClientConfig<T>): Promise<void> {
	return fetch(`${baseURL}${endpoint}`, {
		headers: { ...defaultHeaders, ...headers },
		body: JSON.stringify(body),
		method
	})
		.then(handleError)
		.then((response) => response.json());
}

export default { get, post, patch, delete: remove };

function handleError(response: Response, message = 'Failed to fetch resource') {
	if (!response.ok) throw Error(message);
	return response;
}
