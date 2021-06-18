export const APP_NAME = 'On The Road';
export const APP_DESCRIPTION = 'Your trip starts here';
export const configKey = 'road-trip:token';
export const publicRoutes = ['/', '/logout'];
export const authRoutes = ['/login', '/signup'];
export const GOOGLE_API_KEY =
	import.meta.env.VITE_GOOGLE_API_KEY ?? process?.env?.VITE_GOOGLE_API_KEY;
export const IMAGE_SIZE_LIMIT = 1048576 * 2;
export const PLACEHOLDER_IMAGE = {
	src: 'http://res.cloudinary.com/dgqsebrpj/image/upload/c_thumb,g_center,w_300,h_200/v1623428196/avatar_1623428190781.jpg',
	alt: 'A map, guidebook, and itinerary on a wooden table next to a mug'
};
