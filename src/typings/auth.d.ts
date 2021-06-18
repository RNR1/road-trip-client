declare type User = {
	email: string;
	avatar?: string;
	id: string;
	firstName: string;
	lastName: string;
};

declare type LoginPayload = {
	email: string;
	password: string;
};

declare type SignupPayload = Omit<User, 'id'> & {
	key?: string;
	password: string;
};

declare type AuthResponse = User & {
	message: string;
	token?: string;
};

declare type User = Omit<AuthResponse, 'message' | 'token'>;

export type { LoginPayload, SignupPayload, AuthResponse };
