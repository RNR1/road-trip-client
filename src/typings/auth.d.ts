declare interface LoginPayload {
	email: string;
	password: string;
}

declare interface SignupPayload {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

declare type AuthResponse = {
	message: string;
	token?: string;
	email?: string;
};

export type { LoginPayload, SignupPayload, AuthResponse };
