import { configKey } from '$config/constants';

export const baseURL = import.meta.env.VITE_API_URL ?? process?.env?.VITE_API_URL;
export const defaultHeaders = { 'Content-Type': 'application/json' };
export const authHeader = () => {
	const token = localStorage?.getItem(configKey);
	return token ? { Authorization: `Bearer ${token}` } : {};
};
