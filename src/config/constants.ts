export const APP_NAME = 'On The Road';
export const configKey = 'road-trip:token';
export const publicRoutes = ['/', '/logout'];
export const authRoutes = ['/login', '/signup'];
export const GOOGLE_API_KEY =
	import.meta.env.VITE_GOOGLE_API_KEY ?? process?.env?.VITE_GOOGLE_API_KEY;
