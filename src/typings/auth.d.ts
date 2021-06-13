declare interface LoginPayload {
	email: string;
	password: string;
}

declare interface SignupPayload {
	avatar?: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

declare type AuthResponse = {
	message: string;
	token?: string;
	email?: string;
	avatar: string;
	id: string;
	firstName: string;
	lastName: string;
};

declare type User = Omit<AuthResponse, 'message' | 'token'>;

export type { LoginPayload, SignupPayload, AuthResponse };
