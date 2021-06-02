export const nameInitials = (name: string = 'User') =>
	name
		.split(' ')
		.map((n) => n[0] ?? ' ')
		.join('');

export const asyncWrapper = <T>(promise: Promise<T>) =>
	promise.then((data) => ({ data, error: null })).catch((error: Error) => ({ data: null, error }));

export const readFile = (file: File) =>
	asyncWrapper<string>(
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		})
	);
