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
	}).then(handleResponse);
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
	}).then(handleResponse, () => {});
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
	}).then(handleResponse);
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
	}).then(handleResponse);
}

export default { get, post, patch, delete: remove };

async function handleResponse(response: Response) {
	const data = await response.json();
	if (!response.ok) throw data;
	return data;
}
