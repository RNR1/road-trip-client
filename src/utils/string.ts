export const nameInitials = (name: string = 'User') =>
	name
		.split(' ')
		.map((n) => n[0] ?? ' ')
		.join('');
